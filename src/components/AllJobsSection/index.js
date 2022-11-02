import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'
import JobCard from '../JobCard'
import FilterGroup from '../FilterGroup'

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

class AllJobsSection extends Component {
  state = {
    apiStatus: apiConstantStatus.initial,
    jobsList: [],
    searchInput: '',
    activeEmploymentId: '',
    activeSalaryId: '',
  }

  componentDidMount() {
    this.getJobs()
  }

  getJobs = async () => {
    this.setState({apiStatus: apiConstantStatus.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {activeEmploymentId, activeSalaryId, searchInput} = this.state
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${activeEmploymentId}&minimum_package=${activeSalaryId}&search=${searchInput}`
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

  enterSearchInput = () => {
    this.getProducts()
  }

  changeSearchInput = searchInput => {
    this.setState({searchInput})
  }

  renderSearchInputFiled = () => {
    const {searchInput} = this.state
    return (
      <div className="desktop-search-container ">
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
          onClick={this.enterSearchInput}
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  renderSearchInputMobile = () => {
    const {searchInput} = this.state
    return (
      <div className="mobile-search-container ">
        <input
          value={searchInput}
          type="search"
          placeholder="Search"
          className="search-input"
        />
        <button type="button" testid="searchButton" className="search-icon-btn">
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
        {this.renderSearchInputFiled()}
        {showJobsList ? (
          <ul className="jobs-list">
            {jobsList.map(eachJob => (
              <JobCard jobData={eachJob} key={eachJob.id} />
            ))}
          </ul>
        ) : (
          <div className="no-jobs-found-view">
            <img
              src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
              alt="failure view"
              className="job-failure-img"
            />
            <h1 className="job-failure-heading-text">
              Oops! Something Went Wrong
            </h1>
            <p className="job-failure-description-text">
              We cannot seem to find the page you are looking for
            </p>
            <button type="button" className="retry-button">
              Retry
            </button>
          </div>
        )}
      </div>
    )
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
        onClick={this.renderLoaderView()}
      >
        Retry
      </button>
    </div>
  )

  renderLoaderView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
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

  onChangeEmployTypes = id => {
    this.setState({activeEmploymentId: id}, this.getJobs)
  }

  onChangeSalary = salaryId => {
    this.setState({activeSalaryId: salaryId}, this.getJobs)
  }

  render() {
    const {activeEmploymentId, activeSalaryId, jobsList} = this.state
    const showJobsList = jobsList.length > 100
    return (
      <div className="all-jobs-section">
        {this.renderSearchInputMobile()}
        <FilterGroup
          employmentTypesList={employmentTypesList}
          salaryRangesList={salaryRangesList}
          changeEmployTypes={this.onChangeEmployTypes}
          activeEmploymentId={activeEmploymentId}
          changeSalary={this.onChangeSalary}
          activeSalaryId={activeSalaryId}
          showJobsList={showJobsList}
        />
        {this.renderAllJobs()}
      </div>
    )
  }
}

export default AllJobsSection
