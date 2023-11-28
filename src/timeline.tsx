import React from 'react'
import {
  Eventcalendar,
  MbscCalendarEvent,
  MbscEventcalendarView,
  MbscResource,
} from '@mobiscroll/react'
import '@mobiscroll/react/dist/css/mobiscroll.min.css'

const resourceCount = 60
const eventCount = 60

export const Timeline: React.FC = () => {
  const [largeList, setLargeList] = React.useState<number>(1)

  const view = React.useMemo<MbscEventcalendarView>(() => {
    return {
      timeline: {
        type: 'day',
        startTime: '06:00',
        endTime: '22:00',
        // virtualScroll: false
      },
    }
  }, [])

  const myEvents = React.useMemo<MbscCalendarEvent[]>(() => {
    const events: MbscCalendarEvent[] = []
    const today = new Date().toISOString().slice(0, 10)
    const timeStrings = [
      { start: 'T08:00', end: 'T10:00' },
      { start: 'T16:00', end: 'T17:30' },
      { start: 'T12:00', end: 'T13:00' },
      { start: 'T10:30', end: 'T16:30' },
    ]

    for (let i = 0; i < eventCount; i++) {
      events.push({
        title: `Event ${i}`,
        resource: i % resourceCount,
        start: `${today}${timeStrings[i % timeStrings.length].start}`,
        end: `${today}${timeStrings[i % timeStrings.length].end}`,
      })
    }
    return events
  }, [])

  const myResources = React.useMemo<MbscResource[]>(() => {
    const resources: MbscResource[] = []
    for (let i = 0; i < resourceCount; i++) {
      resources.push({
        id: i,
        name: `Resource ${String.fromCharCode(
          65 + i / 26
        )}${String.fromCharCode(65 + (i % 26))}`,
        color: '#e20000',
      })
    }

    return resources
  }, [])

  const useDistanceToTop = (containerId: string): number[] => {
    const [distanceToTop, setDistanceToTop] = React.useState<number>(0)
    // dynamically size container to fill remaining height
    const container = document.getElementById(containerId)

    React.useEffect(() => {
      const handleResize = () => {
        const distance =
          window.scrollY + (container?.getBoundingClientRect().top || 0)
        setDistanceToTop(distance)
      }
      // set initial size
      handleResize()
      // listen for resize
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }, [container])

    return [distanceToTop]
  }
  const [distanceToTop] = useDistanceToTop('timeline_id')

  const onButtonClick = () => {
    setLargeList(largeList ? 0 : 1)
  }

  return (
    <>
      <button type='button' onClick={onButtonClick}>{`${largeList ? 60 : 8} resources`}</button>
      <div
        style={{
          height: '700px', // `calc(95vh - ${distanceToTop}px)`,
          overflow: 'auto',
          margin: '0 10px',
        }}
      >
        <Eventcalendar
          id={'timeline_id'}
          theme='ios'
          themeVariant='light'
          view={view}
          data={myEvents}
          resources={myResources.slice(0, largeList ? resourceCount : 8)}
        />
      </div>
    </>
  )
}
