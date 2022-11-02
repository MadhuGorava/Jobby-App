import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {FaExternalLinkAlt} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill, BsFillStarFill} from 'react-icons/bs'
import Cookies from 'js-cookie'
import SimilarJobItem from '../SimilarJobItem'
import Header from '../Header'

import './index.css'

const apiConstantsStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobsItemData: {},
    apiStatus: apiConstantsStatus.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({apiStatus: apiConstantsStatus.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const updateJobsData = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebSiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        description: data.job_details.life_at_company.description,
        imageUrl: data.job_details.life_at_company.image_url,
        location: data.job_details.location,
        pkgPerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        title: data.job_details.title,
        skills: data.job_details.skills.map(eachSkill => ({
          name: eachSkill.name,
          imageUrl: eachSkill.image_url,
        })),
        similarData: data.similar_jobs.map(eachData => ({
          companyLogoUrl: eachData.company_logo_url,
          employmentType: eachData.employment_type,
          id: eachData.id,
          jobDescription: eachData.job_description,
          location: eachData.location,
          title: eachData.title,
          rating: eachData.rating,
        })),
      }

      this.setState({
        jobsItemData: updateJobsData,
        apiStatus: apiConstantsStatus.success,
      })
    } else {
      this.setState({apiStatus: apiConstantsStatus.failure})
    }
  }

  renderJobItemView = () => {
    const {jobsItemData} = this.state
    const {
      companyLogoUrl,
      companyWebSiteUrl,
      employmentType,
      jobDescription,
      location,
      pkgPerAnnum,

      rating,
      title,
    } = jobsItemData
    return (
      <div className="job-details-success-view">
        <div className="job-details-container">
          <div className="title-logo-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />
            <div className="line-ht">
              <h1 className="title">{title}</h1>
              <div className="rating-card">
                <BsFillStarFill className="star-icon" />
                <p className="rating">{rating}</p>
              </div>
            </div>
          </div>

          <div className="employment-container">
            <div className="location-empType-container">
              <MdLocationOn className="location-icon" />
              <p className="location">{location}</p>
              <BsBriefcaseFill className="emp-icon" />
              <p className="employment-type">{employmentType}</p>
            </div>
            <p className="pkg-per-annum">{pkgPerAnnum}</p>
          </div>
          <hr className="line" />
          <div className="website-container">
            <h1 className="description-heading">Description</h1>
            <p>
              <a
                href={companyWebSiteUrl}
                rel="noopener noreferrer"
                className="website-url"
                target="_blank"
              >
                Visit <FaExternalLinkAlt />
              </a>
            </p>
          </div>
          <p className="job-description">{jobDescription}</p>
          <h1 className="skill-heading">Skills</h1>
          <ul className="skill-list-container">
            {jobsItemData.skills.map(eachSkill => (
              <li className="skill-item" key={eachSkill.name}>
                <img
                  src={eachSkill.imageUrl}
                  alt={eachSkill.name}
                  className="skill-image"
                  id={eachSkill.name}
                />
                <p className="skill-name">{eachSkill.name}</p>
              </li>
            ))}
          </ul>
          {this.renderLifeAtCompany()}
        </div>
        <h1 className="similar-job-heading">Similar Jobs</h1>
        <ul className="similar-job-list">
          {jobsItemData.similarData.map(eachSimilarData => (
            <SimilarJobItem
              similarJobDetails={eachSimilarData}
              key={eachSimilarData.id}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderLifeAtCompany = () => {
    const {jobsItemData} = this.state
    const {description, imageUrl} = jobsItemData
    return (
      <>
        <h1 className="life-at-company-heading">Life at Company</h1>
        <div className="life-at-company-container">
          <p className="about-life-in-company-text">{description}</p>
          <img
            src={imageUrl}
            alt="life at company"
            className="life-at-company-image"
          />
        </div>
      </>
    )
  }

  onClickRetry = () => {
    this.getJobDetails()
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
        We cannot seem to find the page you are looking for
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

  renderLoaderView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstantsStatus.success:
        return this.renderJobItemView()
      case apiConstantsStatus.failure:
        return this.renderFailureView()
      case apiConstantsStatus.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        <div className="job-item-details-container">
          {this.renderJobDetails()}
        </div>
      </div>
    )
  }
}

export default JobItemDetails
