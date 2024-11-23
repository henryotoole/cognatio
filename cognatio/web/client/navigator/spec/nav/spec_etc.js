/**
 * @file Test a variety of small misc functions
 * @author Josh Reed
 */

import { url_is_internal, url_to_page_name } from "nav"

describe("ETC Paths utilities", function()
{
	it("can determine if a URL is same origin as window", function()
	{

		expect(url_is_internal("https://www.example.com/this/that")).toBe(false)
		expect(url_is_internal("/this/that")).toBe(true)
		expect(url_is_internal(window.origin + "/this/that")).toBe(true)
		expect(url_is_internal("ooga" + window.origin + "/this/that")).toBe(false)
	})

	it("can convert URL's to page names", function()
	{
		expect(url_to_page_name("/this/that")).toBe("that")
		expect(url_to_page_name(window.origin + "/this/that")).toBe("that")
		expect(url_to_page_name(window.origin + "/this/that.html")).toBe("that")
		expect(url_to_page_name(window.origin)).toBe(undefined)
		expect(url_to_page_name("ooga" + window.origin + "/this/that")).toBe(undefined)
	})
})