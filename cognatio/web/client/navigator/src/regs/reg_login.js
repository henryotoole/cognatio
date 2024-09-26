/**
 * @file Contains region for login step
 * @author Josh Reed
 */

import { RegConstellation } from "../nav.js";
import { Region, Fabricator, RHElement, RegInInput, validate_email } from "../lib/regional.js";

/**
 * This login region is simple. It sits in front of a constellation region that makes the background look pretty.
 * It has provisions for login and signup.
 */
class RegLogin extends Region
{
	fab_get()
	{
		let css = /* css */`
			[rfm_reg="RegLogin"] {
				& .cont-outer {
					position: relative;
					top: 0; left: 0;
					width: 100%; height: 100%;
					
					opacity: 100%;
					background-color: var(--white-off);
				}
				& .constellation {
					top: 0; left: 0;
					width: 100%; height: 100%;
				}
				/** Outer layer exists so that messenger can be defined by gauge width / height but not bound
				by overflow hidden. */
				& .gauge-box {
					position: absolute;
					width: 20em; height: 20em;
					top: calc(50% - 10em); left: calc(50% - 10em);
				}
				/** This is the master circular object at the center of the screen. */
				& .gauge {
					position: absolute;
					width: 100%; height: 100%;
					top: 0; left: 0;
					box-sizing: border-box;

					background-color: var(--metal-lighter);
					border: 3px solid var(--brass);
					border-radius: 10em;

					overflow: hidden;
				}
				/** Internal component that rotates from 90 to 0 degrees as view is changed.s */
				& .cont-rotate {
					position: absolute;
					width: 300%; height: 300%;
					top: -100%; left: -200%;

					transition: 1s;
				}
				/** Position an interface within the rotating div. */
				& .cont-rotate-inner {
					position: absolute;
					width: 100%; height: 100%;
					top: 0; left: 0;

					display: flex;
					flex-direction: row;
					justify-content: flex-end;
					align-items: center;

					pointer-events: none;
				}
				/** Contain an interface. This just ensures box size is right. */
				& .cont-interface {
					position: relative;
					width: calc(100% / 3); height: calc(100% / 3);
					border-radius: 50%;
					box-sizing: border-box;
					
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-items: center;

					pointer-events: all;
				}
				& .interface {
					position: relative;
					width: 80%; height: 80%;
					box-sizing: border-box;
					border-radius: 50%;
					overflow: hidden;
					
					color: var(--brass-light);
					font-family: "IBM Mono";

					border: 3px solid var(--brass);
					background-color: var(--brass-lightest);
					
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;

					box-shadow: grey 0.25em 0.25em;
				}
				& .interface-rec {
					width: 100%;
					box-sizing: border-box;
					padding-left: 10%; padding-right: 10%;
					border-top: 2px solid var(--brass);
					border-bottom: 2px solid var(--brass);
				}
				& .title {
					color: var(--brass-light);
					font-size: 1.3em;
					font-weight: 400;

					margin: 0.25em;
				}
				& .button {
					margin: 0.5em;
					padding: 0.25em;
					border-radius: 0.5em;
					border: 2px solid var(--brass);
				}
				& button:hover {
					text-decoration: underline;
				}
				& .bolt-lane {
					position: absolute;
					width: 90%; height: 0;

					display: flex;
					flex-direction: row;
					justify-content: flex-end;
					align-items: center;
				}
				& bolt {
					position: absolute;
					width: 1em; height: 1em;
					border-radius: 50%;
					right: -0.5em;
					box-sizing: border-box;

					border: 2px solid var(--brass);
					background-color: var(--brass-lightest);
				}
				& .input-line {
					margin-top: 0.5em;
				}
				& .input-line:last-of-type {
					margin-bottom: 0.5em;
				}
				& input {
					all: unset;
					cursor: text;
					color: white;
				}
				& .messenger {
					position: absolute;
					top: calc(50% - 2em); left: 4%;
					height: 4em; width: 80%;

					background-color: white;
					border: 2px solid var(--brass);

					box-shadow: inset 0px 0px 1em 1em var(--white-off);
				}
				& .messenger-text {
					margin-left: 1em;
					border-left: 6px double var(--red);
					box-sizing: border-box;
					height: 100%;
					color: var(--red);

					padding: 0.5em;
				}
			}
		`
		let html = /* html */`
		<div rfm_member='cont_outer' class='cont-outer'>
			<div rfm_member='constellation' class='constellation'></div>
			<div class='gauge-box'>
				<div rfm_member='messenger' class='messenger'>
					<div rfm_member='messenger_text' class='messenger-text'></div>
				</div>
				<div class='gauge'>
					<div rfm_member='cont_rotate' class='cont-rotate'>
						<div class='cont-rotate-inner' style='transform: rotate(90deg)'>
							<div class='cont-interface'>
							<machine class='interface'>
									<div class='title'> New Account </div>
									<div class='interface-rec'>
										<div class='terminal input-line'>
											<div rfm_member='new_email'></div>
										</div>
										<div class='terminal input-line'>
											<div rfm_member='new_password'></div>
										</div>
										<div class='terminal input-line'>
											<div rfm_member='new_password2'></div>
										</div>
									</div>
									<div class='row'>
										<button rfm_member='btn_new' class='button'>Create</button>
										<button rfm_member='btn_to_login' class='button'>Back</button>
									</div>
								</machine>
								<div class='bolt-lane' style='transform: rotate(0deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(30deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(60deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(90deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(120deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(150deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(180deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(210deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(240deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(270deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(300deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(330deg)'><bolt></bolt></div>
							</div>
						</div>
						<div class='cont-rotate-inner'>
							<div class='cont-interface'>
								<machine class='interface'>
									<div class='title'> Navigator Login </div>
									<div class='interface-rec'>
										<div class='terminal input-line'>
											<div rfm_member='login_email'></div>
										</div>
										<div class='terminal input-line'>
											<div rfm_member='login_password'></div>
										</div>
									</div>
									<div class='row'>
										<button rfm_member='btn_login' class='button'>Login</button>
										<button rfm_member='btn_to_signup' class='button'>New</button>
									</div>
								</machine>
								<div class='bolt-lane' style='transform: rotate(0deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(30deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(60deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(90deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(120deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(150deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(180deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(210deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(240deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(270deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(300deg)'><bolt></bolt></div>
								<div class='bolt-lane' style='transform: rotate(330deg)'><bolt></bolt></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		`
		return new Fabricator(html).add_css_rule(css)
	}
	
	/** @type {RegSWNav} Reference to the switchyard region. */
	swyd
	/** @type {RHElement} */
	cont_outer
	/** @type {RHElement} */
	cont_rotate
	/** @type {RHElement} */
	login_email
	/** @type {RHElement} */
	login_password
	/** @type {RHElement} */
	btn_to_signup
	/** @type {RHElement} */
	btn_login
	/** @type {RHElement} */
	btn_to_login
	/** @type {RHElement} */
	btn_new
	/** @type {RHElement} */
	messenger
	/** @type {RHElement} */
	messenger_text

	_create_subregions()
	{
		this.reg_constellation = new RegConstellation({
			text_left: "COGNATIO",
			text_right: "NAVIGATOR"
		}).fab().link(this, this.constellation)

		// Login section
		this.regin_login_email = new RegInInput().fab().link(this, this.login_email, this.settings, "login_email")
		this.regin_login_email.member_get("input").setAttribute("placeholder", "Email")
		this.regin_login_password = new RegInInput().fab().link(this, this.login_password, this.settings, "login_password")
		this.regin_login_password.member_get("input").setAttribute("placeholder", "Password")
		this.regin_login_password.member_get("input").setAttribute("type", "password")

		// New account
		this.regin_new_email = new RegInInput().fab().link(this, this.new_email, this.settings, "new_email")
		this.regin_new_email.member_get("input").setAttribute("placeholder", "Email")
		this.regin_new_password = new RegInInput().fab().link(this, this.new_password, this.settings, "new_password")
		this.regin_new_password.member_get("input").setAttribute("placeholder", "Password")
		this.regin_new_password.member_get("input").setAttribute("type", "password")
		this.regin_new_password2 = new RegInInput().fab().link(this, this.new_password2, this.settings, "new_password2")
		this.regin_new_password2.member_get("input").setAttribute("placeholder", "Password")
		this.regin_new_password2.member_get("input").setAttribute("type", "password")
	}

	_on_link_post()
	{
		this.datahandler_subscribe(this.swyd.dh_user)

		this.btn_to_signup.addEventListener('click', ()=>
		{
			this.settings.interface = 1
			this.render()
		})
		this.btn_login.addEventListener('click', ()=>{this.login()})
		this.btn_to_login.addEventListener('click', ()=>
		{
			this.settings.interface = 0
			this.render()
		})
		this.btn_new.addEventListener('click', ()=>{this.create()})

		// Enter listeners
		let enter_listener = (action, e)=>
		{
			if(e.code == "Enter")
			{
				e.preventDefault()
				action.bind(this)() // Javascript is so goofy I love it so much
			}
		}
		this.regin_login_email.member_get("input").addEventListener('keydown', enter_listener.bind(this, this.login))
		this.regin_login_password.member_get("input").addEventListener('keydown', enter_listener.bind(this, this.login))
		this.regin_new_email.member_get("input").addEventListener('keydown', enter_listener.bind(this, this.create))
		this.regin_new_password.member_get("input").addEventListener('keydown', enter_listener.bind(this, this.create))
		this.regin_new_password2.member_get("input").addEventListener('keydown', enter_listener.bind(this, this.create))
	}

	/**
	 * Attempt to log in with current settings.
	 */
	login()
	{
		this.settings.message = ""
		let email = this.settings.login_email
		let pw = this.settings.login_password

		if(!validate_email(email))
		{
			this.settings.message = "Email is invalid."
			this.render()
			return
		}
		if(pw.length == 0)
		{
			this.settings.message = "A password is required."
			this.render()
			return
		}

		this.swyd.dispatch.call_server_function('login', email, pw).then((id)=>
		{
			return this.swyd.set_user(id)
		}).then(()=>
		{
			this.deactivate()
		}).catch((e)=>
		{
			this.settings.message = "Account with these credentials does not exist."
			this.render()
		})
	}

	/**
	 * Attempt to create a new account with provided info.
	 */
	create()
	{
		this.settings.message = ""
		let email = this.settings.new_email
		let password = this.settings.new_password
		let password2 = this.settings.new_password2

		if(!validate_email(email))
		{
			this.settings.message = "Email is invalid."
			this.render()
			return
		}
		if(password.length < 12)
		{
			this.settings.message = "Password must be at least twelve characters."
			this.render()
			return
		}
		if(password != password2)
		{
			this.settings.message = "You fool! Passwords do not match."
			this.render()
			return
		}

		this.swyd.dispatch.call_server_function('account_create', email, password).then((id)=>
		{
			this.settings.message = "Account created! Now log in."
			this.settings.interface = 0
			this.render()
		}).catch((e)=>
		{
			if(e.code == 700)
			{
				this.settings.message = "Account with this email already exists."
			}
			else
			{
				this.settings.message = "Server rejected new account."
			}
			this.render()
		})
	}


	/**
	 * Toggle which interface is visible.
	 */
	toggle_interface()
	{
		this.settings.interface = this.settings.interface ? 0 : 1
		this.render()
	}

	_on_settings_refresh()
	{
		this.settings.interface = 0
		this.settings.message = ""
		this.settings.login_email = ""
		this.settings.login_password = ""
		this.settings.new_email = ""
		this.settings.new_password = ""
		this.settings.new_password2 = ""
	}

	_on_render()
	{
		// View choice
		this.cont_rotate.style.transform = `rotate(${this.settings.interface * -90}deg)`

		// Messenger
		this.messenger.style.left = this.settings.message.length > 0 ? '-80%' : ''
		this.messenger_text.text(this.settings.message)
	}
}

export { RegLogin }