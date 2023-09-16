export function createTimestampedResponse() {
    return { timestamp: new Date().toISOString(), locale: Intl.DateTimeFormat().resolvedOptions().timeZone }
}

export function createErrorJsonResponse(error: Error, status: number) {
    return { ...createTimestampedResponse(), message: error.message, status: status }
}