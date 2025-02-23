import { FormEvent, useState, ChangeEvent } from 'react'
import './App.css'

function App() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    corporationNumber: '',
  });
  
  function _onFormInputChange(event: ChangeEvent<HTMLInputElement>) {
    let { value } = event.target;
    if (event.target.name === 'phone') {
      if (!value.startsWith('+1')) {
        value = '+1' + value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
      } else {
        value = '+1' + value.slice(2).replace(/[^0-9]/g, ''); // Keep +1 and remove non-numeric characters
      }
    }

    setFormData({
      ...formData,
      [event.target.name]: value,
    })
  }

  async function _onFormSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors('');
    setIsSubmitting(true);

    const validationRes = await fetch(`https://fe-hometask-api.dev.vault.tryvault.com/corporation-number/${formData.corporationNumber}`)
    const validationData = await validationRes.json();
    
    if (!validationData?.valid) {
      setErrors(validationData.message)
      setIsSubmitting(false)
      return;
    } 

    const formSubmitRes = await fetch('https://fe-hometask-api.dev.vault.tryvault.com/profile-details', {
       method: 'POST', body: JSON.stringify(formData),
       headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    });
    
    setIsSubmitting(false);
    if (formSubmitRes.status === 200){
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        corporationNumber: '',
      })
      setErrors('');  
    } else {
      const formSubmitData = await formSubmitRes.json()
      setErrors(formSubmitData.message);  
    }
  }

  return (
    <section className="onboarding-section">
      <form name="onboardingForm" autoComplete="on" className="onboarding-form" onSubmit={_onFormSubmit}>
        <h1 className="form-title">Onboarding Form</h1>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input type="text" id="firstName" name="firstName" maxLength={50} value={formData.firstName}
              onChange={_onFormInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input type="text" id="lastName" name="lastName" maxLength={50}  value={formData.lastName}
              onChange={_onFormInputChange} required />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input type="tel" id="phone" name="phone" pattern="\+1[0-9]{10}" maxLength={12}
            title='The phone number must start with +1 and contain 10 other digits'  value={formData.phone}
            onChange={_onFormInputChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="corporationNumber">Corporation Number</label>
          <input type="text" id="corporationNumber" name="corporationNumber" maxLength={9}
             value={formData.corporationNumber} onChange={_onFormInputChange} required />
          {
            !!errors?.length &&
            <span className='error-message'>{errors}</span>
          }
        </div>

        <button type="submit" className="submit-button">
          { isSubmitting ? 
            <span>Submitting ...</span> :
            <span>Submit <i className="bi bi-arrow-right"></i></span>
          }
        </button>
      </form>
    </section>
  )
}

export default App