import { hashSync, compareSync, genSaltSync } from 'bcrypt'

export function hash(phrase) {
  return hashSync(phrase, genSaltSync(10))
}

export function compareHash(received, stored) {
  return compareSync(received, stored)
}