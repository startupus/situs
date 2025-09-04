import React from 'react';

const Preview = () => {
  return (
    <div>
      <section className="relative flex min-h-screen w-full items-start bg-gray">
        <div className="sidebar-wrapper">
          <div className="vertical-navbar">
            <div className="nav-item">Home</div>
            <div className="nav-item">Dashboard</div>
            <div className="nav-item">Products</div>
            <div className="dropdown-item">Dropdown One</div>
            <div className="dropdown-item">Dropdown Two</div>
            <div className="dropdown-item">Dropdown Three</div>
            <div className="nav-item">Messages</div>
            <div className="nav-item">Order</div>
            <div className="nav-item">Calendar</div>
            <div className="nav-item">Static</div>
            <div className="nav-item">Documents</div>
            <div className="divider"></div>
            <div className="nav-item">Chat</div>
            <div className="nav-item">Settings</div>
            <div className="nav-item">Log out</div>
          </div>
        </div>

        <div className="relative z-50 ml-0 w-full xl:ml-[300px]">
          <div className="menu-button">Menu</div>
          <header className="w-full bg-white">
            <div className="horizontal-menu">
              <div className="nav-right">
                <div className="submenu-item">Account Settings</div>
                <div className="submenu-item">Dashboard</div>
                <div className="submenu-item">Sign Out</div>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="setting-top">
              <h1>Account Settings</h1>
              <p>Manage your account settings and preferences</p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="left-column">
                <div className="input-group">
                  <label>Full Name</label>
                  <input type="text" placeholder="Enter your full name" defaultValue="Musharof Chowdhury" />
                </div>
                <div className="input-group">
                  <label>Email</label>
                  <input type="email" placeholder="Enter your email" defaultValue="hello@tailgrids.com" />
                </div>
                <div className="input-group">
                  <label>Phone Number</label>
                  <input type="text" placeholder="Enter your phone number" defaultValue="+1 (555) 123-4567" />
                </div>
                <div className="input-group">
                  <label>Company</label>
                  <input type="text" placeholder="Enter your company name" defaultValue="TailGrids" />
                </div>
                <div className="input-group">
                  <label>Job Title</label>
                  <input type="text" placeholder="Enter your job title" defaultValue="Frontend Developer" />
                </div>
                <div className="input-group">
                  <label>Bio</label>
                  <textarea
                    placeholder="Tell us about yourself"
                    defaultValue="I'm a passionate frontend developer with 5+ years of experience in React and Vue.js."
                  />
                </div>
              </div>

              <div className="right-column">
                <div className="input-group">
                  <label>Current Password</label>
                  <input type="password" placeholder="Enter your current password" />
                </div>
                <div className="input-group">
                  <label>New Password</label>
                  <input type="password" placeholder="Enter your new password" />
                </div>
                <div className="input-group">
                  <label>Confirm Password</label>
                  <input type="password" placeholder="Confirm your new password" />
                </div>
                <button className="submit-button">Save</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Preview;
