import React from 'react';

const SideBarItem = ({ title, url }) => {
    return ( <>
        <aside className="sidebar">
            <div className="sidebar__head">
                <h3 className="sidebar__title">{title}</h3>
                <a className="sidebar__link" href={url}>See all</a>
            </div>
        </aside>
    </> );
}
 
export default SideBarItem;