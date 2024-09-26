/**
 * @file Holds the Vector class
 * @author Josh Reed
 */

/**
 * A basic class to represent a 2D quantity. Vectors are immutable after creation and will cache-prop certain
 * computed quantities. Immutability here is not enforced, this is a developer-contract sort of thing.
 */
class Vector2D
{
	/**
	 * Instantiate a new vector quantity.
	 * 
	 * @param {Number} x X-value of end of vector
	 * @param {Number} y Y-value of end of vector
	 */
	constructor(x, y)
	{
		this.x = x
		this.y = y
	}

	/**
	 * Get the value of the angle to this vector (theta) in radians.
	 */
	get theta()
	{
		if(this._theta == undefined)
		{
			this._theta = Math.atan2(this.y, this.x)
		}
		return this._theta
	}

	/**
	 * Get the length of this vector, the absolute value, the magnitude.
	 */
	get magnitude()
	{
		if(this._mag == undefined)
		{
			this._mag = Math.sqrt(this.x**2 + this.y**2)
		}
		return this._mag
	}

	/**
	 * Short for 'pythagorean sum'. Not sure what to call this. Get the sum of the square of x and y.
	 */
	get pysum()
	{
		if(this._pythag == undefined)
		{
			this._pythag = this.x**2 + this.y**2
		}
		return this._pythag
	}

	/**
	 * Add a series of vectors together.
	 * 
	 * @param {*} vec_or_vecs Either a vector2d or a list of vector2d's
	 * 
	 * @returns {Vector2D} A new vector instance that is the sum of all provided and self.
	 */
	add(vec_or_vecs)
	{
		let vecs = vec_or_vecs instanceof Array ? vec_or_vecs : [vec_or_vecs]
		vecs.push(this)
		return Vector2D.sum(vecs)
	}

	/**
	 * Subtract the provided vector from this vector and return a new vector.
	 * 
	 * @param {Vector2D} vec
	 */
	subtract(vec)
	{
		return this.add(vec.mult_scalar(-1))
	}

	/**
	 * Sum a list of vectors.
	 * 
	 * @param {Array} vecs List of vectors
	 * 
	 * @returns {Vector2D}
	 */
	static sum(vecs)
	{
		let x = 0, y = 0
		vecs.forEach((vec)=>
		{
			x += vec.x
			y += vec.y
		})
		return new Vector2D(x, y)
	}

	/**
	 * Perform scalar multiplication against this vector
	 * 
	 * @param {Number} m Scalar value to multiply this vector by
	 * 
	 * @returns {Vector2D} Resulting vector.
	 */
	mult_scalar(m)
	{
		return new Vector2D(this.x * m, this.y * m)
	}

	/**
	 * Get whether the provided vector equals this vector. Equal if x == x and y == y, but with a slight
	 * tolerance to deal with nastly floating point rounding.
	 * 
	 * @param {Vector2D} vec
	 * @param {Number} tol Optional multiplier for tolerance. Default 1E-6
	 * 
	 * @returns {Boolean} 
	 */
	equals(vec, tol=0.000001)
	{
		return this.at(vec.x, vec.y, tol)
	}

	/**
	 * Get whether this vector 'points at' the provided coords. Equal if x == x and y == y, but with a slight
	 * tolerance to deal with nastly floating point rounding.
	 * 
	 * @param {Number} x x-coord
	 * @param {Number} y y-coord
	 * 
	 * @returns {Boolean}
	 */
	at(x, y, tol=0.000001)
	{
		let dx = x - this.x,
			dy = y - this.y
		return dx < tol && dy < tol
	}

	/**
	 * Construct a new vector from polar, rather than cartesian, coordiantes. Theta is taken to be CCW positive
	 * from the x-axis.
	 * 
	 * @param {Number} theta Angle in radians
	 * @param {Number} dist Distance
	 * 
	 * @returns {Vector2D} The resulting vector
	 */
	static from_polar(theta, dist)
	{
		return new Vector2D(
			dist * Math.cos(theta),
			dist * Math.sin(theta),
		)
	}
}

export { Vector2D }