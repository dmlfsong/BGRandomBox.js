window.onload = function() {
	var boxAmount = 40; // Box amount
	var boxStrokeStyle = '#000'; // Box stroke color
	var boxMaxSize = 40;
	var boxMinSize = 2;

	var canvas = document.getElementById('moveBoxBG');
	if(canvas.getAttribute('data-strokeStyle') != '') boxStrokeStyle = canvas.getAttribute('data-strokeStyle');
	var ctx = canvas.getContext('2d');
	var windowSize = {
		w : window.innerWidth,
		h : window.innerHeight,
	}

	// Resize canvas to innerWindow size.
	function setCanvasSize() {
		canvas.setAttribute('width', windowSize.w);
		canvas.setAttribute('height', windowSize.h);
	}

	function drawMovingRect() {
		const STEP = 10; //Pixel of move step.
		var axis = [],
			plusFlags = [], // Bounce flag
			steps = [],
			sizes = [];

		// Init box info
		for(var i = 0; i < boxAmount; i++) {
			axis[i] = {
				// Initial coordinates of box
				x : getRandom(windowSize.w),
				y : getRandom(windowSize.h),
			};

			var flag = false;
			if(getRandom(2) == 1) flag = true;
			plusFlags[i] = {
				x : flag,
				y : flag
			};
			
			steps[i] = {
				// Axis moving step.
				x : STEP + getRandom(6) - 5,
				y : STEP + getRandom(6) - 5
			};

			sizes[i] = {
				// Box size
				w : 8 + getRandom(30),
				h : 8 + getRandom(30),

				// If true, box size becomes larger when rendering began.
				zoomFlag : true,

				// Maximam box size
				zoomMax : 20 + getRandom(boxMaxSize),

				// Minimam box size
				zoomMin : boxMinSize
			};
		}

		function render() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.beginPath();
			ctx.strokeStyle = boxStrokeStyle;

			for(var i = 0;i < boxAmount; i++) {

				// Zoom trigger
				if(sizes[i].zoomFlag) {

					sizes[i].w++;
					sizes[i].h++;
					if(sizes[i].w >= sizes[i].zoomMax && sizes[i].h >= sizes[i].zoomMax)
						sizes[i].zoomFlag = false;

				} else {
					sizes[i].w--;
					sizes[i].h--;
					if(sizes[i].w <= sizes[i].zoomMin && sizes[i].h <= sizes[i].zoomMin) sizes[i].zoomFlag = true;
				}

				ctx.strokeRect(axis[i].x, axis[i].y, sizes[i].w, sizes[i].h);

				// X
				if(axis[i].x >= canvas.width - (STEP * 2) && plusFlags[i].x) {
					plusFlags[i].x = false;
					axis[i].x -= steps[i].x;

				} else if(axis[i].x < STEP && !plusFlags[i].x) {
					plusFlags[i].x = true;
					axis[i].x += steps[i].x;

				} else {
					if(plusFlags[i].x) axis[i].x += steps[i].x;
					else axis[i].x -= steps[i].x;

				}

				// Y
				if(axis[i].y > canvas.height - (STEP * 2) && plusFlags[i].y) {
					plusFlags[i].y = false;
					axis[i].y -= steps[i].y;
					steps[i].y -= getRandom(1) + 2;

				} else if(axis[i].y < STEP && !plusFlags[i].y) {
					plusFlags[i].y = true;
					axis[i].y += steps[i].y;
					steps[i].y += getRandom(1) + 2;

				} else {
					if(plusFlags[i].y) axis[i].y += STEP;
					else axis[i].y -= steps[i].y;

				}

			}
		}
		setInterval(render, 50);
	}

	window.onresize = function() {
		windowSize.w = window.innerWidth;
		windowSize.h = window.innerHeight;
		setCanvasSize();
	};

	function getRandom(n) { return Math.floor(Math.random() * n); }

	setCanvasSize();
	drawMovingRect();
};