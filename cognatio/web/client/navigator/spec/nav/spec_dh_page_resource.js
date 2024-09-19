/**
 * @file Test the DHPageResource implementation. This will access an actual backend, which ought to be
 *       running in a development mode at the same URL as SpecRunner.html
 * @author Josh Reed
 */

import { DHPageResource, DHPage } from "nav"

describe("DH Page resource", function()
{
	let dh_resource, dh_page, test_page_id
	beforeAll(async ()=>{
		dh_resource = new DHPageResource()
		dh_page = new DHPage()
		dh_resource._max_payload_size = 64 // 8 chars?

		// Setup test page.
		// Attempt to lookup the ID for this page name.
		return dh_page.list({'name': 'test_page'}).then((ids)=>
		{
			if(ids.length == 0)
			{
				return dh_page.create(2, 'test_page').then((data)=>
				{
					test_page_id = data.id
					return Promise.resolve()
				})
			}
			else
			{
				test_page_id = ids[0]
				return Promise.resolve()
			}
		}).then(()=>
		{
			dh_resource.current_page_set(test_page_id)
			return dh_resource.track_all()
		}).then(()=>
		{
			return dh_resource.pull()
		})
	})

	it("Can go through a full upload cycle with working state at all points.", function()
	{
		let text = "A long string, which will be sent in a couple parts and verified in a moment."
		let payload = new Blob([text])

		let dh = dh_resource

		expect(payload.size).toBeGreaterThan(dh._max_payload_size)

		return dh.delete("test_resource.txt").catch(()=>{}).finally(()=>
		{
			return dh.create("test_resource.txt", payload)
		}).then(()=>
		{
			return dh.list()
		}).then((ids)=>
		{
			expect(ids).toEqual(['test_resource.txt'])
			return fetch(
				dh.data_get_ref('test_resource.txt').url,
				{
					method: "GET"
				}
			)
		}).then((response)=>
		{
			expect(response.status).toEqual(200)
			return response.text()
		}).then((response_text)=>
		{
			expect(response_text).toEqual(text)
			return dh.delete("test_resource.txt")
		}).then(()=>
		{
			return dh.list()
		}).then((ids)=>
		{
			expect(ids).toEqual([])
		})
	})
})