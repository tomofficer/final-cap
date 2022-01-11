import { useState } from 'react';
import { useHistory } from 'react-router';
import { createTable } from '../utils/api';
import { today } from '../utils/date-time';

const NewTable = () => {
  const history = useHistory();

  async function handleSubmit(e) {
    console.log(formFields);
    e.preventDefault();
    await createTable(formFields).then((output) =>
      history.push(`/dashboard?date=${today()}`)
    );
    // .catch(errors);
  }

  function handleCancel() {
    alert('Are you sure you want to cancel?');
    history.push(`/dashboard?date=${today()}`);
  }

  const [formFields, setFormFields] = useState({
    table_name: '',
    capacity: 0,
  });

  return (
    <div className='bootstrap-iso'>
      <div className='container-fluid'>
        <h2 className='pt-5 libreFont'>New Table</h2>
        <div className='row'>
          <div className='col-md-6 col-sm-6 col-xs-12'>
            <form onSubmit={handleSubmit} method='post'>
              {/* {errorList()} */}
              <div className='form-group'>
                <label
                  className='control-label requiredField'
                  htmlFor='tableName'>
                  Table Name
                  <span className='asteriskField'>*</span>
                </label>
                <input
                  className='form-control'
                  id='tableName'
                  name='tableName'
                  type='text'
                  onChange={(e) =>
                    setFormFields({ ...formFields, table_name: e.target.value })
                  }
                />
              </div>
              <div className='form-group '>
                <label className='control-label requiredField' htmlFor='name1'>
                  Capacity
                  <span className='asteriskField'>*</span>
                </label>
                <input
                  className='form-control'
                  id='number'
                  name='name1'
                  type='number'
                  onChange={(e) =>
                    setFormFields({
                      ...formFields,
                      capacity: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div className='form-group'>
                <div>
                  <button
                    className='btn btn-primary mr-4'
                    name='submit'
                    type='submit'>
                    <span className='oi oi-check mr-2'></span>
                    Submit
                  </button>
                  <button
                    onClick={handleCancel}
                    className='btn btn-danger'
                    type='button'>
                    <span className='oi oi-circle-x mr-2'></span>
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTable;
