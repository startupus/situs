import React from 'react';
// import VerticalNavbar from '../VerticalNavbar2'; // Temporarily disabled
// import NavItem from '../VerticalNavbar2/NavItem'; // Temporarily disabled
// import DropdownItem from '../VerticalNavbar2/DropdownItem'; // Temporarily disabled
// import Divider from '../VerticalNavbar2/Divider'; // Temporarily disabled
// import Icon from '../VerticalNavbar2/Icon'; // Temporarily disabled
// import Icon from '../VerticalNavbar2/Icon'; // Temporarily disabled
// import Icon from '../VerticalNavbar2/Icon'; // Temporarily disabled
// import Icon from '../VerticalNavbar2/Icon'; // Temporarily disabled
// import Icon from '../VerticalNavbar2/Icon'; // Temporarily disabled
// import Icon from '../VerticalNavbar2/Icon'; // Temporarily disabled
// import Icon from '../VerticalNavbar2/Icon'; // Temporarily disabled
// import Icon from '../VerticalNavbar2/Icon'; // Temporarily disabled
// import Icon from '../VerticalNavbar2/Icon'; // Temporarily disabled
// import Icon from '../VerticalNavbar2/Icon'; // Temporarily disabled
// import Icon from '../VerticalNavbar2/Icon'; // Temporarily disabled
import SettingsPage from '../SettingsPage';
import SidebarWrapper from '../SettingsPage/SidebarWrapper';
// import HorizontalMenu from '../HorizontalMenu/index'; // Temporarily disabled
// import NavRight from '../HorizontalMenu/NavRight'; // Temporarily disabled
// import SubmenuItem from '../HorizontalMenu/SubmenuItem'; // Temporarily disabled
import MenuButton from '../SettingsPage/MenuButton';
import SettingTop from '../SettingsPage/SettingTop';
import LeftColumn from '../SettingsPage/LeftColumn';
import RightColumn from '../SettingsPage/RightColumn';
import InputGroup from '../SettingsPage/InputGroup';
import TextareaGroup from '../SettingsPage/TextareaGroup';

const Preview = () => {
  return (
    <SettingsPage>
      <section className="relative flex min-h-screen w-full items-start bg-gray-2">
        <SidebarWrapper>
          <div
            className="vertical-navbar"
            /* link="/#" */
            data-logo="https://cdn.tailgrids.com/2.0/image/assets/images/logo/logo-primary.svg"
            data-user-img="https://cdn.tailgrids.com/2.0/image/assets/images/avatar/image-05.jpg"
            data-user-name="Musharof"
            data-user-email="hello@tailgrids.com"
          >
            <div>NavItem Home</div>
            <div>NavItem Dashboard</div>
            <div>NavItem Products</div>
            <div>NavItem Messages</div>
            <div>NavItem Order</div>
            <div>NavItem Calendar </div>
            <div>NavItem Static </div>
            <div>NavItem Documents </div>
            <div>Divider</div>
            <div>NavItem Chat </div>
            <div>NavItem Settings </div>
            <div>NavItem Log out </div>
          </div>
        </SidebarWrapper>

        <div className="relative z-50 ml-0 w-full xl:ml-[300px]">
          <MenuButton />
          <header className="w-full bg-white">
            <div className="horizontal-menu">
              <div
                className="nav-right"
                /* userName="Thomas Anree" */
                data-user-position="Ux Designer"
                data-user-img="https://cdn.tailgrids.com/2.0/image/assets/images/avatar/image-02.jpg"
              >
                <div className="submenu-item">Account Settings</div>
                <div className="submenu-item">Dashboard</div>
                <div className="submenu-item">Sign Out</div>
              </div>
            </div>
          </header>

          <div className="p-[30px]">
            <SettingTop
              title="Settings Page"
              subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ultrices lectus sem."
              button1="Cancel"
              button2="Save"
            />
            <div className="-mx-4 flex flex-wrap">
              <LeftColumn title="Personal Information">
                <div className="w-full px-3 md:w-1/2">
                  <InputGroup
                    {...({ email: '' } as any)}
                    labelTitle="Full Name"
                    type="text"
                    value="Devid Jhon"
                    placeholder="Devid Jhon"
                    name=""
                  />
                </div>
                <div className="w-full px-3 md:w-1/2">
                  <InputGroup
                    {...({ email: '' } as any)}
                    labelTitle="Phone Number"
                    type="text"
                    value="+990 3343 7865"
                    placeholder="+990 3343 7865"
                    name=""
                  />
                </div>
                <div className="w-full px-3">
                  <InputGroup
                    {...({ email: '' } as any)}
                    labelTitle="Email Address"
                    type="text"
                    value="devidjhon24"
                    placeholder="devidjhon24"
                    email
                    name=""
                  />
                </div>
                <div className="w-full px-3">
                  <InputGroup
                    {...({ email: '' } as any)}
                    labelTitle="Username"
                    type="text"
                    value="devidjond45@gmail.com"
                    placeholder="devidjond45@gmail.com"
                    email
                    name=""
                  />
                </div>
                <div className="w-full px-3">
                  <TextareaGroup
                    labelTitle="BIO"
                    placeholder="Write your BIO"
                    value="Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Aliquam lacinia turpis tortor, consequat efficitur mi
                      congue a. Curabitur cursus, ipsum ut lobortis sodales,
                      enim arcu pellentesque lectus ac suscipit diam sem a
                      felis."
                  />
                </div>
              </LeftColumn>
              <RightColumn
                title="Your Photo"
                subtitle="Edit your photo"
                img="https://cdn.tailgrids.com/2.0/image/assets/images/avatar/image-05.jpg"
              ></RightColumn>
            </div>
          </div>
        </div>
      </section>
    </SettingsPage>
  );
};

export default Preview;
