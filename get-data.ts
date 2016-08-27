/// <reference path="typings/index.d.ts" />

import { DataSponsor, DataEvent } from './data-interfaces'
import fs = require('fs')
const moment = require('moment')

// returns null if the time is invalid
// takes moment object and time string ('16:00')
function setTime(mom, time: string): number {
  const [hour, minute] = time.split(':')

  if (isInt(hour) && isInt(minute)) return mom.set('hour', hour).set('minute', minute).valueOf()

  if (time.length)
    console.warn(`Unable to parse time: ${time}`)

  return null
}

function isInt (n: string): boolean {
  const i = parseInt(n)
  if (i === 0) return true
  return !!i;
}

function splitEventData (str, sponsor: DataSponsor): DataEvent {
  // str is csv of row in spread sheet
  const [date, timeStart, timeEnd, location, locationAddress, description, timeMeet, meetLocation, meetLocationAddress] = str.split(',')

  const momentDate = moment(date).set('year', 2016)
  const startTime = isInt(timeStart) ? setTime(momentDate, timeStart) : null
  const endTime = isInt(timeEnd) ? setTime(momentDate, timeEnd) : null
  const meetTime = isInt(timeMeet) ? setTime(momentDate, timeMeet) : null

  let evt: DataEvent = {
    sponsor,
    description,
    startTime,
    endTime,
    location,
    locationAddress,
    meetTime,
    meetLocation,
    meetLocationAddress
  }
  return evt;
}

function extractEvents (fileContents): DataEvent[]  {
  const [, sponsorData,, ...eventsData] = fileContents.split(/\s*\n\s*/g)
  console.log("# Sponsor", sponsorData)

  const [sponsorName, sponsorNickname, sponsorLetters, sponsorTwitter] = sponsorData.split(',')

  // TODO use twitter for colors
  let sponsorColorsFiltered = null // sponsorColors.filter((s) => s.length > 0)

  const sponsor: DataSponsor = {
    name: sponsorName,
    letters: sponsorLetters,
    nickname: sponsorNickname || null,
    twitter: sponsorTwitter || null,
    colors: sponsorColorsFiltered || null }

  console.log(`# Events (${eventsData.length})`, eventsData)

  let events = eventsData.map((evString) => splitEventData(evString, sponsor))

  return events
}

export function create (done: (error, events: DataEvent[]) => any) {
	let data: DataEvent[] = []

  fs.readdirSync('./data')
    .map((bn) => fs.readFileSync(`./data/${bn}`, 'utf8')) // get file contents
    .map(extractEvents)                                   // map to events
    .forEach((ev) => ev.forEach((evt) => data.push(evt))) // push each to results

	done(null, data)
}