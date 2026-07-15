import './Form.css'

function Form() {
  return (
    <div className="form-container">
      <form>
        <label htmlFor="fname">First name:</label>
        <input type="text" id="fname" name="fname" required />

        <label htmlFor="lname">Last name:</label>
        <input type="text" id="lname" name="lname" required />

        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required />

        <label htmlFor="phone">Phone Number:</label>
        <input type="tel" id="phone" name="phone" />
      </form>
    </div>
  )
}

export default Form