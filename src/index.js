import './index.html';
import './styles/css/style.css';
import './styles/index.scss';

import { interpolate } from 'flubber';
import gsap from 'gsap';

console.log(123);

const sections = document.querySelectorAll('.section');
const svgElement = document.querySelector('svg');
const pathElements = svgElement.querySelectorAll('path');
const pathToMorph = document.getElementById('path1');

let currentIndex = 0;

pathElements.forEach((path, index) => {
	if (index !== 0) {
		path.remove();
	}
});

const paths = Array.from(pathElements).map((path) => path.getAttribute('d'));

function updateMorph1(scrollPosition) {
	const maxScroll = document.body.scrollHeight - window.innerHeight;
	const sectionHeight = maxScroll / (sections.length - 1);
	const currentSection = Math.floor(scrollPosition / sectionHeight);
	const progressWithinSection =
		(scrollPosition % sectionHeight) / sectionHeight;

	if (currentSection !== currentIndex && currentSection < paths.length) {
		currentIndex = currentSection;
		const startPath = paths[currentSection];
		const endPath = paths[currentSection + 1] || paths[currentSection];
		const interpolator = interpolate(startPath, endPath);

		gsap.to(pathToMorph, {
			duration: 0.5,
			attr: { d: interpolator(progressWithinSection) },
			ease: 'power1.inOut',
		});
	}
}

function updateMorph2(scrollPosition) {
	const maxScroll = document.body.scrollHeight - window.innerHeight;
	const sectionHeight = maxScroll / (sections.length - 1);
	const currentSection = Math.floor(scrollPosition / sectionHeight);

	if (currentSection >= paths.length) {
		currentIndex = paths.length - 1;
	}

	let progressWithinSection = (scrollPosition % sectionHeight) / sectionHeight;

	if (currentSection !== currentIndex) {
		currentIndex = currentSection;

		if (currentSection === paths.length - 1) {
			progressWithinSection = 1;
		}
	}

	const startPath = paths[currentSection];
	const endPath = paths[currentSection + 1] || paths[currentSection];
	const interpolator = interpolate(startPath, endPath);

	console.log(currentSection, currentSection + 1);

	gsap.to(pathToMorph, {
		duration: 0,
		attr: { d: interpolator(progressWithinSection) },
		ease: 'none',
	});
}

function wait(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function updateMorphLoop() {
	let i = 0;
	const loop = () => {
		if (i >= paths.length - 1) {
			i = 0;
		}

		const startPath = paths[i];
		const endPath = paths[i + 1];

		const interpolator = interpolate(startPath, endPath);

		gsap.to(pathToMorph, {
			duration: 0.8,
			attr: { d: interpolator(1) },
			ease: 'power2.inOut',
			onComplete: async () => {
				await wait(1_000);
				i++;
				loop();
			},
		});
	};

	loop();
}

updateMorphLoop();

// updateMorph2(window.scrollY);

// window.addEventListener('scroll', function () {
// 	const scrollPosition = window.scrollY;
// 	updateMorph1(scrollPosition);
// });
