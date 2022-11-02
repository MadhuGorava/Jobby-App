import {Link} from 'react-router-dom'
import {BsBriefcaseFill, BsFillStarFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import './index.css'

const JobCard = props => {
  const {jobData} = props
  const {
    companyLogoUrl,
    title,
    rating,
    employmentType,
    location,
    jobDescription,
    pkgPerAnnum,
    id,
  } = jobData

  return (
    <Link to={`/jobs/${id}`} className="link-item">
      <li className="job-item">
        <div className="title-logo-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
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
        <h1 className="description">Description</h1>
        <p className="job-description">{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobCard
