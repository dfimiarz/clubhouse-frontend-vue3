import axios from 'axios'
import auth from '@/firebase'

import type { PassInfo, OverlapInfo } from '@/types'
import { z } from 'zod'

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND,
})

instance.interceptors.request.use(
  async (config) => {
    if (auth.currentUser) {
      try {
        const idtoken = await auth.currentUser.getIdToken()
        config.headers.authorization = `Bearer ${idtoken}`
        return config
      } catch {
        throw new Error('Unable to retrieve user token')
      }
    } else {
      return config
    }
  },
  (err) => {
    return Promise.reject(err)
  },
)

export function getBookings(date: string) {
  const url = new URL(import.meta.env.VITE_APP_BACKEND + '/bookings')

  const date_schema = z.string().date()

  const result = date_schema.safeParse(date)

  if (!result.success) {
    Promise.reject('Invalid date format')
  }

  url.searchParams.set('date', date)

  return instance.get(url.toString())
}

export function newMatch(matchdata) {
  return instance.post(import.meta.env.VITE_APP_BACKEND + '/bookings', matchdata)
}

export function getBookingDetails(id) {
  return instance.get(import.meta.env.VITE_APP_BACKEND + '/bookings/' + id)
}

export function endSession(params) {
  return instance.patch(import.meta.env.VITE_APP_BACKEND + `/bookings/${params.id}`, {
    cmd: {
      name: 'END_SESSION',
      params: {
        hash: params.hash,
      },
    },
  })
}

export function removeSession(params) {
  return instance.patch(import.meta.env.VITE_APP_BACKEND + `/bookings/${params.id}`, {
    cmd: {
      name: 'REMOVE_SESSION',
      params: {
        hash: params.hash,
      },
    },
  })
}

export function changeSessionTime(params) {
  return instance.patch(import.meta.env.VITE_APP_BACKEND + `/bookings/${params.id}`, {
    cmd: {
      name: 'CHANGE_TIME',
      params: {
        hash: params.hash,
        start: params.start,
        end: params.end,
      },
    },
  })
}
export function changeCourt(params) {
  return instance.patch(import.meta.env.VITE_APP_BACKEND + `/bookings/${params.id}`, {
    cmd: {
      name: 'CHANGE_COURT',
      params: {
        hash: params.hash,
        court: params.court,
      },
    },
  })
}

export function getCourts() {
  return instance.get('/courts')
}

export function getMembers() {
  return instance.get(import.meta.env.VITE_APP_BACKEND + '/persons/members')
}

export function getActiveMembers() {
  return instance.get(import.meta.env.VITE_APP_BACKEND + '/persons/members/active')
}

export function getGuests() {
  return instance.get(import.meta.env.VITE_APP_BACKEND + '/persons/guests')
}

export async function addGuest(guest) {
  return await instance.post(import.meta.env.VITE_APP_BACKEND + '/persons/guests', guest)
}

export async function getEligiblePersons() {
  return instance.get(import.meta.env.VITE_APP_BACKEND + '/persons/eligible')
}

export async function getActivePersons() {
  return instance.get(import.meta.env.VITE_APP_BACKEND + '/persons/active')
}

export async function getInactiveGuests() {
  return instance.get(import.meta.env.VITE_APP_BACKEND + '/persons/guests/inactive')
}

export async function getCurrentGuestActivations() {
  return instance.get(import.meta.env.VITE_APP_BACKEND + '/guest_activations/current')
}

export async function deactivateGuest(activation) {
  //Configure patch commands
  const patchcommand = {
    name: 'DEACTIVATE',
    params: { etag: activation.etag },
  }

  return instance.patch(import.meta.env.VITE_APP_BACKEND + `/guest_activations/${activation.id}`, {
    cmd: patchcommand,
  })
}

/**
 *  Get Booking Types
 */
export async function getBookingTypes() {
  return instance.get(import.meta.env.VITE_APP_BACKEND + '/booking_types')
}

/**
 * Get event hosts
 *
 * @returns {Promise<AxiosResponse<any>>}
 */

export async function getEventHosts() {
  return instance.get(import.meta.env.VITE_APP_BACKEND + '/persons/eventhosts')
}

/**
 *
 * @param {Number} memberhost_id ID of the active member host
 * @param {Number[]} guests Array of IDs for inactive guets
 */
export async function activateGuests(memberhost_id, guests) {
  return instance.post(import.meta.env.VITE_APP_BACKEND + '/guest_activations/bulk', {
    memberhost: memberhost_id,
    guests: guests,
  })
}

export async function checkGeoAuth() {
  return axios.get(import.meta.env.VITE_APP_BACKEND + '/auth/geo')
}

export async function getRecaptchaScore(token) {
  //Build a rest URL and add recaptcha token
  const url = new URL(import.meta.env.VITE_APP_BACKEND + '/auth/recaptchascore')

  url.searchParams.set('token', token)

  const result = await axios.get(url.toString())

  return result.data
}

export async function getCaptcha() {
  const url = new URL(import.meta.env.VITE_APP_BACKEND + '/auth/captcha')

  const result = await axios.get(url.toString())

  return result.data
}

//TODO: Change front end call to include an object of correct type
export async function getOverlappingBookings(overlap: OverlapInfo) {
  const url = new URL(import.meta.env.VITE_APP_BACKEND + '/bookings/overlapping')

  url.searchParams.set('date', overlap.date)
  url.searchParams.set('start', overlap.start)
  url.searchParams.set('end', overlap.end)
  url.searchParams.set('court', overlap.court.toString())

  const result = await instance.get(url.toString())

  return result.data
}

export async function getUserRole() {
  const url = new URL(import.meta.env.VITE_APP_BACKEND + '/auth/user/role')

  const result = await instance.get(url.toString())

  return result.data
}

export async function getUserProfile() {
  const url = new URL(import.meta.env.VITE_APP_BACKEND + '/auth/user/profile')

  const result = await instance.get(url.toString())

  return result.data
}

/**
 * Call the server to check if the connection is alive
 * @returns {Promise<boolean>}
 */
export async function checkConnection(): Promise<boolean> {
  const url = new URL(import.meta.env.VITE_APP_BACKEND + '/alive')

  const result = await axios.get(url.toString())

  //Validate the response against the schema
  const ConnectionStatusSchema = z.object({
    status: z.literal('ok'),
  })

  const connstatus = ConnectionStatusSchema.safeParse(result.data)

  //If the response is valid, return true
  if (connstatus.success) {
    return true
  } else {
    //If the response is not valid, throw an error
    throw new Error('Unexpected response from server')
  }
}

export async function getClubSchedule() {
  const url = new URL(import.meta.env.VITE_APP_BACKEND + '/club_schedule')

  const result = await instance.get(url.toString())

  return result.data
}

export async function getClubInfo() {
  const url = new URL(import.meta.env.VITE_APP_BACKEND + '/club')

  const result = await axios.get(url.toString())

  return result.data
}

export async function runReport(name, from, to) {
  const url = new URL(import.meta.env.VITE_APP_BACKEND + `/reports/${name}`)

  //If from is set but to is not, set to to from
  if (from && !to) {
    to = from
  } else if (!from && to) {
    from = to
  }

  //if from and to are set, add them to the url
  if (from != null && to != null) {
    url.searchParams.set('from', from)
    url.searchParams.set('to', to)
  }

  const result = await instance.get(url.toString())

  return result
}

export async function getActivitiesForDates(from, to) {
  const url = new URL(import.meta.env.VITE_APP_BACKEND + '/activities')

  //If from is set but to is not, set to to from
  if (from && !to) {
    to = from
  } else if (!from && to) {
    from = to
  }

  //if from and to are set, add them to the url
  if (from != null && to != null) {
    url.searchParams.set('from', from)
    url.searchParams.set('to', to)
  }

  const result = await instance.get(url.toString())

  return result.data
}

export async function createGuestPass(passInfo: PassInfo) {
  return instance.post(import.meta.env.VITE_APP_BACKEND + '/guest_passes', {
    host: passInfo.host,
    guest: passInfo.guest,
    pass_type: passInfo.pass_type,
  })
}

export async function getGuestPassTypes() {
  return instance.get(import.meta.env.VITE_APP_BACKEND + '/guest-pass-types')
}

export async function getPaymentTypes() {
  return instance.get(import.meta.env.VITE_APP_BACKEND + '/payment-types')
}
