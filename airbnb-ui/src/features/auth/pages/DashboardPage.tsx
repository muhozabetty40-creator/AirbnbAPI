import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  AiOutlineDashboard, AiOutlinePlus, AiOutlineWallet,
  AiOutlineMessage, AiOutlineHeart, AiOutlineSetting,
  AiOutlineUser, AiOutlineArrowUp, AiOutlineArrowDown,
  AiOutlineMenu, AiOutlineStar, AiOutlineBook
} from 'react-icons/ai'
import { BsBookmark, BsListUl } from 'react-icons/bs'
import { useAuth } from '../hooks/useAuth'
import { useStore } from '../../../store/StoreContext'
import './DashboardPage.css'

const NAV = [
  { icon: <AiOutlineDashboard size={18} />, label: 'Dashboard', to: '/dashboard' },
  { icon: <AiOutlinePlus size={18} />, label: 'Add listing', to: '/dashboard/add' },
  { icon: <AiOutlineWallet size={18} />, label: 'Wallet', to: '/dashboard/wallet' },
  { icon: <AiOutlineMessage size={18} />, label: 'Message', to: '/dashboard/messages', badge: 2 },
]

const LISTING_NAV = [
  { icon: <BsListUl size={16} />, label: 'My Listing', to: '/dashboard/listings' },
  { icon: <AiOutlineStar size={16} />, label: 'Reviews', to: '/dashboard/reviews' },
  { icon: <AiOutlineBook size={16} />, label: 'Bookings', to: '/dashboard/bookings' },
  { icon: <BsBookmark size={16} />, label: 'Bookmark', to: '/dashboard/bookmarks' },
  { icon: <AiOutlineMenu size={16} />, label: 'Multi Level Menu', to: '/dashboard/menu' },
]

const ACCOUNT_NAV = [
  { icon: <AiOutlineUser size={16} />, label: 'Edit Profile', to: '/dashboard/profile', highlight: true },
  { icon: <AiOutlineSetting size={16} />, label: 'Setting', to: '/dashboard/settings', highlight: true },
]

export default function DashboardPage() {
  const { email, logout } = useAuth()
  const { state, dispatch } = useStore()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const name = email ? email.split('@')[0].replace(/[._]/g, ' ') : 'User'
  const displayName = name.charAt(0).toUpperCase() + name.slice(1)

  return (
    <div className="db-layout">

      {/* ── Sidebar ── */}
      <aside className={`db-sidebar${sidebarOpen ? '' : ' db-sidebar--closed'}`}>
        <div className="db-sidebar__brand">
          <span className="db-brand-logo">List</span>
          <span className="db-brand-highlight">On</span>
        </div>

        <nav className="db-nav">
          {NAV.map(item => (
            <NavLink key={item.to} to={item.to} end className={({ isActive }) => `db-nav__item${isActive ? ' db-nav__item--active' : ''}`}>
              {item.icon}
              <span>{item.label}</span>
              {item.badge && <span className="db-nav__badge">{item.badge}</span>}
            </NavLink>
          ))}

          <p className="db-nav__section">LISTING</p>
          {LISTING_NAV.map(item => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `db-nav__item${isActive ? ' db-nav__item--active' : ''}`}>
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}

          <p className="db-nav__section">ACCOUNT</p>
          {ACCOUNT_NAV.map(item => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `db-nav__item${isActive ? ' db-nav__item--active' : ''} db-nav__item--account`}>
              {item.icon}
              <span className="db-nav__account-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* ── Main ── */}
      <div className="db-main">

        {/* Banner */}
        <div className="db-banner">
          <div className="db-banner__content">
            <div className="db-banner__icon">
              <span style={{ fontSize: 28 }}>🏠</span>
            </div>
            <div>
              <h2 className="db-banner__title">Welcome, {displayName}!</h2>
              <p className="db-banner__desc">
                Manage your listings, track bookings, and grow your hosting business
                all from one place.
              </p>
              <button
                type="button"
                className="db-banner__btn"
                onClick={() => navigate('/')}
              >
                Browse Listings
              </button>
            </div>
          </div>
          <div className="db-banner__illustration">🏡</div>
        </div>

        {/* Stat cards */}
        <div className="db-stats">
          <div className="db-stat-card">
            <div>
              <p className="db-stat-card__label">Times Bookmarked</p>
              <p className="db-stat-card__value">{state.saved.length}:{String(state.saved.length * 15).padStart(2, '0')}</p>
            </div>
            <div className="db-stat-card__icon db-stat-card__icon--red">
              <AiOutlineArrowUp size={28} color="#ff5724" />
            </div>
          </div>

          <div className="db-stat-card">
            <div>
              <p className="db-stat-card__label">Progress</p>
              <p className="db-stat-card__value">70%</p>
            </div>
            <div className="db-stat-card__icon">
              <svg viewBox="0 0 36 36" width="48" height="48">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#ff5724" strokeWidth="3"
                  strokeDasharray="70 30" strokeLinecap="round"
                  transform="rotate(-90 18 18)" />
              </svg>
            </div>
          </div>

          <div className="db-stat-card">
            <div>
              <p className="db-stat-card__label">Revenue</p>
              <p className="db-stat-card__value">$100</p>
            </div>
            <div className="db-stat-card__icon db-stat-card__icon--red">
              <AiOutlineArrowUp size={28} color="#ff5724" />
            </div>
          </div>

          <div className="db-stat-card">
            <div>
              <p className="db-stat-card__label">Time-Spent</p>
              <p className="db-stat-card__value">2:45</p>
            </div>
            <div className="db-stat-card__icon db-stat-card__icon--red">
              <AiOutlineArrowDown size={28} color="#ff5724" />
            </div>
          </div>
        </div>

        {/* Metrics row */}
        <div className="db-metrics">
          <div className="db-metric">
            <div className="db-metric__header">
              <span className="db-metric__label">Total Income</span>
              <AiOutlineArrowUp size={16} color="#22c55e" />
            </div>
            <p className="db-metric__value">$5,899 <span className="db-metric__unit">(USD)</span></p>
            <p className="db-metric__change db-metric__change--up">20.9% <span>+18.4k this week</span></p>
          </div>

          <div className="db-metric">
            <div className="db-metric__header">
              <span className="db-metric__label">Visitors</span>
              <AiOutlineArrowUp size={16} color="#22c55e" />
            </div>
            <p className="db-metric__value">780,192</p>
            <p className="db-metric__change db-metric__change--up">20% <span>+3.5k this week</span></p>
          </div>

          <div className="db-metric">
            <div className="db-metric__header">
              <span className="db-metric__label">Total Orders</span>
              <AiOutlineArrowDown size={16} color="#ef4444" />
            </div>
            <p className="db-metric__value">796,542</p>
            <p className="db-metric__change db-metric__change--down">9.01% <span>decrease compared to last week</span></p>
          </div>
        </div>

        {/* Saved listings + actions */}
        <div className="db-bottom">
          <div className="db-saved">
            <h3 className="db-saved__title">Saved Listings</h3>
            <p className="db-saved__count">{state.saved.length} listing{state.saved.length !== 1 ? 's' : ''} saved</p>
            <div className="db-saved__actions">
              <button type="button" className="db-btn db-btn--outline" onClick={() => dispatch({ type: 'RESET' })}>
                Clear All Saved
              </button>
              <button type="button" className="db-btn db-btn--danger" onClick={() => { logout(); navigate('/login') }}>
                Sign out
              </button>
            </div>
          </div>

          <div className="db-profile">
            <div className="db-profile__avatar">{displayName.charAt(0).toUpperCase()}</div>
            <div>
              <p className="db-profile__name">{displayName}</p>
              <p className="db-profile__email">{email}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
