import { useParams, useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { AiFillStar, AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { MdLocationOn } from 'react-icons/md'
import { IoArrowBack } from 'react-icons/io5'
import numeral from 'numeral'
import { useStore } from '../../../store/StoreContext'
import { useFavorites } from '../hooks/useFavorites'

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>()
  const { state } = useStore()
  const { toggle, isSaved } = useFavorites()
  const navigate = useNavigate()

  const listing = state.listings.find(l => l.id === Number(id))

  if (!listing) {
    return (
      <main className="detail-page">
        <p className="detail-page__not-found">Listing not found.</p>
        <button type="button" className="detail-page__back" onClick={() => navigate(-1)}>← Go back</button>
      </main>
    )
  }

  const saved = isSaved(listing.id)

  return (
    <main className="detail-page">
      <button type="button" className="detail-page__back" onClick={() => navigate(-1)}>
        <IoArrowBack size={16} /> Back
      </button>

      <div className="detail-card">
        <div className="detail-card__image-wrap">
          <img src={listing.img} alt={listing.title} className="detail-card__image" />
          {listing.superhost && <span className="detail-card__badge">Superhost</span>}
          {listing.price > 300 && <span className="detail-card__badge detail-card__badge--luxury">Luxury</span>}
        </div>

        <div className="detail-card__body">
          <div className="detail-card__header">
            <h1 className="detail-card__title">{listing.title}</h1>
            <button
              type="button"
              className="detail-card__heart"
              onClick={() => toggle(listing.id, listing.title)}
              aria-label="Save"
            >
              {saved ? <AiFillHeart size={22} color="#ff385c" /> : <AiOutlineHeart size={22} />}
            </button>
          </div>

          <p className="detail-card__location"><MdLocationOn size={16} /> {listing.location}</p>

          <div className="detail-card__meta">
            <span className="detail-card__rating"><AiFillStar size={14} /> {listing.rating.toFixed(2)}</span>
            <span className="detail-card__category">{listing.category}</span>
            <span className={`detail-card__status detail-card__status--${listing.available ? 'available' : 'booked'}`}>
              {listing.available ? 'Available' : 'Booked'}
            </span>
          </div>

          <p className="detail-card__price">
            <strong>{numeral(listing.price).format('$0')}</strong> / night
          </p>

          <p className="detail-card__date">
            Available from: <strong>{dayjs(listing.availableFrom).format('MMM D, YYYY')}</strong>
          </p>
        </div>
      </div>
    </main>
  )
}
