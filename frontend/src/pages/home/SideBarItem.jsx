import React from 'react';

const SideBarItem = ({ title, url }) => {
	const healthLinks = [
		{ name: 'WebMD', url: 'https://www.webmd.com' },
		{ name: 'Mayo Clinic', url: 'https://www.mayoclinic.org' },
		{ name: 'Healthline', url: 'https://www.healthline.com' },
		{ name: 'NIH', url: 'https://www.nih.gov' },
		{ name: 'WHO', url: 'https://www.who.int' }
	];

	return (<>
		<aside className="sidebar">
			<div className="sidebar__head">
				<h3 className="sidebar__title p-2">{title}</h3>
			</div>
			{/* <a className="sidebar__link" href={url}>See all</a> */}

			<ul className="list-group list-group-flush">
				{healthLinks.map((link, index) => (
					<li key={index} className="list-group-item p-2">
						<a 
							href={link.url} 
							className="text-decoration-none text-dark" 
							target="_blank" 
							rel="noopener noreferrer"
						>
							{link.name}
						</a>
					</li>
				))}
			</ul>
		</aside>
	</>);
}

export default SideBarItem;