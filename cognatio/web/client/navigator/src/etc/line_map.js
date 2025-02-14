/**
 * Contains the LineMap abstraction class.
 */

/**
 * The LineMap is a helper of a text editor which both does the work of converting bulk text into lines and
 * keeps track of certain resulting metadata (such as which lines are the product of word-wrap). The metadata
 * and the lines themselves are tied together and ought to occupy the same memory space.
 */
class LineMap
{
	constructor()
	{
		this.text_raw = ""
		this.lines = [
			// Contains data of form:
			// {text: actual characters, TODO}
		]
	}

	/**
	 * Convert bulk text into a list of lines that will contain no newline characters. Takes wordwrap
	 * into account.
	 * 
	 * @param {String} text Raw, bulk text containing newlines
	 * @param {Number} word_wrap_width The column width to wrap words at, or undefined for no word wrap.
	 */
	text_laminate(text, word_wrap_width)
	{
		// TODO
	}

	/**
	 * @returns {Array.<String>} List of lines as simple String objects, sans metadata.
	 */
	get lines_simple()
	{
		let lines = []
		this.lines.forEach((line_data)=>
		{
			lines.push(line_data.text)
		})
		return lines
	}
}

export {LineMap}