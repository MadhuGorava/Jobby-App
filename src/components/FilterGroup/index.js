import Loader from 'react-loader-spinner'
import Profile from '../Profile'
import './index.css'

const FilterGroup = props => {
  const {showJobsList} = props

  const renderEmploymentTypesList = () => {
    const {employmentTypesList} = props
    return employmentTypesList.map(empType => {
      const {changeEmployTypes} = props
      const onClickEmploymentTypeList = () => {
        changeEmployTypes(empType.employmentTypeId)
      }
      return (
        <li
          key={empType.employmentTypeId}
          className="items"
          onClick={onClickEmploymentTypeList}
        >
          <input type="checkbox" className="input" id="emp" />
          <label htmlFor="emp" className="label-name" value="label">
            {empType.label}
          </label>
        </li>
      )
    })
  }

  const renderEmploymentTypes = () => (
    <>
      <h1 className="heading">Type of Employment</h1>
      <ul className="emp-types-list">{renderEmploymentTypesList()}</ul>
    </>
  )

  const renderSalaryRangesList = () => {
    const {salaryRangesList} = props
    return salaryRangesList.map(salary => {
      const {changeSalary, activeSalaryId} = props
      const onClickSalaryRange = () => {
        changeSalary(salary.salaryRangeId)
      }
      return (
        <li
          className="items"
          key={salary.salaryRangeId}
          onClick={onClickSalaryRange}
        >
          <input
            type="radio"
            className="input"
            name="salary"
            id="input-radio"
            value={activeSalaryId}
          />
          <label value="label" htmlFor="input-radio" className="label-name">
            {salary.label}
          </label>
        </li>
      )
    })
  }

  const renderSalaryRange = () => (
    <>
      <h1 className="heading">Salary Range</h1>
      <ul className="salary-range-list">{renderSalaryRangesList()}</ul>
    </>
  )

  const renderLoaderView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  return (
    <div>
      {showJobsList ? (
        <Profile />
      ) : (
        <button
          type="button"
          className="retry-button"
          onClick={renderLoaderView}
        >
          Retry
        </button>
      )}
      <hr className="line" />
      {renderEmploymentTypes()}
      <hr className="line" />
      {renderSalaryRange()}
    </div>
  )
}

export default FilterGroup
