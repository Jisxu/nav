// @ts-nocheck
// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.

import axios from 'axios'
import NProgress from 'nprogress'
import { getToken } from '../utils/user'
import config from '../../nav.config'

const DEFAULT_TITLE = document.title
const headers: Record<string, string> = {}

const httpInstance = axios.create({
  timeout: 60000 * 3,
  baseURL:
    config.provider === 'Gitee'
      ? 'https://gitee.com/api/v5'
      : 'https://api.github.com',
  headers,
})

function startLoad() {
  NProgress.start()
  document.title = 'Connecting...'
}

function stopLoad() {
  NProgress.done()
  document.title = DEFAULT_TITLE
}

Object.setPrototypeOf(httpInstance, axios)

httpInstance.interceptors.request.use(
  function (config) {
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = `token ${token}`
    }
    startLoad()

    return config
  },
  function (error) {
    stopLoad()
    return Promise.reject(error)
  }
)

httpInstance.interceptors.response.use(
  function (res) {
    stopLoad()
    return res
  },
  function (error) {
    stopLoad()
    return Promise.reject(error)
  }
)

export default httpInstance
