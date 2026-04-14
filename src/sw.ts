/// <reference lib="webworker" />

import { precacheAndRoute } from 'workbox-precaching'

declare const self: ServiceWorkerGlobalScope & { __WB_MANIFEST: any }

// Precache the build files
precacheAndRoute(self.__WB_MANIFEST)
