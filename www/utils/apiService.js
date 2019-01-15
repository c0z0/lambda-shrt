// const apiUrl = 'https://s.cserdean.me/'
const apiUrl = '/api/'
/**
 * Hits the api and returns the shortened url
 * @param {string} url Url to shorten
 * @returns
 */
export const shorten = async url => {
	const res = await fetch(apiUrl + 'sh', {
		method: 'POST',
		body: JSON.stringify({ url }),
		headers: new Headers({
			'Content-Type': 'application/json'
		})
	})

	if (!res.ok) {
		throw new Error(res.statusText)
	}

	const { id } = await res.json()

	return window.location.href + id
}
