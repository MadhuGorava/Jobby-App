import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'
import JobCard from '../JobCard'
import Header from '../Header'
import Profile from '../Profile'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiConstantStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    apiStatus: apiConstantStatus.initial,
    jobsList: [],
    searchInput: '',
    employmentTypeListId: [],
    activeSalaryId: '',
  }

  componentDidMount() {
    this.getJobs()
  }

  getJobs = async () => {
    this.setState({apiStatus: apiConstantStatus.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {employmentTypeListId, activeSalaryId, searchInput} = this.state
    // updated
    const employmentType = employmentTypeListId.join(',')

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${activeSalaryId}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      const data = await response.json()

      const updatedData = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        pkgPerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobsList: updatedData,
        apiStatus: apiConstantStatus.success,
      })
    } else {
      this.setState({apiStatus: apiConstantStatus.failure})
    }
  }

  onChangeSearchInput = event => {
    const {value} = event.target
    this.setState({searchInput: value})
  }

  onEnterSearchInput = () => {
    this.getJobs()
  }

  renderSearchInputFiled = () => {
    const {searchInput} = this.state
    return (
      <div className="desktop-search-container mobile-searchInput">
        <input
          type="search"
          placeholder="Search"
          value={searchInput}
          className="search-input"
          onChange={this.onChangeSearchInput}
        />
        <button
          type="button"
          testid="searchButton"
          className="search-icon-btn"
          onClick={this.onEnterSearchInput}
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  renderJobsList = () => {
    const {jobsList} = this.state
    const showJobsList = jobsList.length > 0

    return (
      <div className="all-jobs-container">
        <div className="desktop-search">{this.renderSearchInputFiled()}</div>
        {showJobsList ? (
          <ul className="jobs-list">
            {jobsList.map(eachJob => (
              <JobCard
                jobData={eachJob}
                key={eachJob.id}
                onChangeEmployees={this.onChangeEmployees}
              />
            ))}
          </ul>
        ) : (
          <div className="no-jobs-found-view">
            <img
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png "
              alt="no jobs"
              className="job-failure-img"
            />
            <h1 className="job-failure-heading-text">No Jobs Found</h1>
            <p className="job-failure-description-text">
              We could not find any jobs. Try other filters
            </p>
          </div>
        )}
      </div>
    )
  }

  renderLoaderView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onClickRetry = () => {
    this.getJobs()
  }

  renderFailureView = () => (
    <div className="job-failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="job-failure-img"
      />
      <h1 className="job-failure-heading-text">Oops! Something Went Wrong</h1>
      <p className="job-failure-description-text">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={this.onClickRetry}
      >
        Retry
      </button>
    </div>
  )

  renderAllJobs = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstantStatus.success:
        return this.renderJobsList()
      case apiConstantStatus.failure:
        return this.renderFailureView()
      case apiConstantStatus.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  onChangeEmployTypesIds = event => {
    const {employmentTypeListId} = this.state
    const isChecked = event.target.checked

    // add values to array
    if (isChecked) {
      this.setState(
        {
          employmentTypeListId: [...employmentTypeListId, event.target.id],
        },
        this.getJobs,
      )
    } else {
      // remove item from array
      const filtered = employmentTypeListId.filter(
        eachItem => eachItem !== event.target.id,
      )
      this.setState({employmentTypeListId: filtered}, this.getJobs)
    }
  }

  renderEmploymentTypesList = () => (
    <>
      {employmentTypesList.map(empType => (
        <li key={empType.employmentTypeId} className="emp-type-item">
          <input
            type="checkbox"
            className="checkbox-input"
            id={empType.employmentTypeId}
            onChange={this.onChangeEmployTypesIds}
          />
          <label
            htmlFor={empType.employmentTypeId}
            className="label-name"
            value="label"
          >
            {empType.label}
          </label>
        </li>
      ))}
    </>
  )

  onCLickSalaryRangeList = event => {
    this.setState({activeSalaryId: event.target.id}, this.getJobs)
  }

  renderSalaryRangesList = () => {
    const {activeSalaryId} = this.state
    return salaryRangesList.map(salary => (
      <li className="salary-type-item" key={salary.salaryRangeId}>
        <input
          type="radio"
          className="input"
          name="salary"
          id={salary.salaryRangeId}
          value={activeSalaryId}
          onClick={this.onCLickSalaryRangeList}
        />
        <label
          value="label"
          htmlFor={salary.salaryRangeId}
          className="label-name"
        >
          {salary.label}
        </label>
      </li>
    ))
  }

  render() {
    return (
      <>
        <Header />
        <div className="jobs-section">
          <div className="all-jobs-section">
            <div>
              <div className="mobile-search-container">
                {this.renderSearchInputFiled()}
              </div>
              <Profile />
              <h1 className="heading">Type of Employment</h1>
              <ul className="emp-types-list">
                {this.renderEmploymentTypesList()}
              </ul>
              <hr className="line" />
              <h1 className="heading">Salary Range</h1>
              <ul className="salary-range-list">
                {this.renderSalaryRangesList()}
              </ul>
            </div>
            {this.renderAllJobs()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
