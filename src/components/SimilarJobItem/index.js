import {MdLocationOn} from 'react-icons/md'
import {BsFillStarFill, BsBriefcaseFill} from 'react-icons/bs'
import './index.css'

const SimilarJobItem = props => {
  const {similarJobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = similarJobDetails

  return (
    <li className="similar-item">
      <div className="title-logo-container">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
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
      <h1 className="description-heading">Description</h1>
      <p className="job-description">{jobDescription}</p>
      <div className="location-empType-container">
        <MdLocationOn className="location-icon" />
        <p className="location">{location}</p>
        <BsBriefcaseFill className="emp-icon" />
        <p className="employment-type">{employmentType}</p>
      </div>
    </li>
  )
}

export default SimilarJobItem
