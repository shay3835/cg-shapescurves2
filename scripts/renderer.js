class Renderer {
    // canvas:              object ({id: __, width: __, height: __})
    // num_curve_sections:  int
    constructor(canvas, num_curve_sections, show_points_flag) {
        this.canvas = document.getElementById(canvas.id);
        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;
        this.ctx = this.canvas.getContext('2d', {willReadFrequently: true});
        this.slide_idx = 0;
        this.num_curve_sections = num_curve_sections;
        this.show_points = show_points_flag;
    }

    // n:  int
    setNumCurveSections(n) {
        this.num_curve_sections = n;
        this.drawSlide(this.slide_idx);
    }

    // flag:  bool
    showPoints(flag) {
        this.show_points = flag;
        this.drawSlide(this.slide_idx);
    }
    
    // slide_idx:  int
    drawSlide(slide_idx) {
        this.slide_idx = slide_idx;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let framebuffer = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

        switch (this.slide_idx) {
            case 0:
                this.drawSlide0(framebuffer);
                break;
            case 1:
                this.drawSlide1(framebuffer);
                break;
            case 2:
                this.drawSlide2(framebuffer);
                break;
            case 3:
                this.drawSlide3(framebuffer);
                break;
        }

        this.ctx.putImageData(framebuffer, 0, 0);
    }

    // framebuffer:  canvas ctx image data
    drawSlide0(framebuffer) {
        let num_edges = this.num_curve_sections;

        //First curve
        let color1 = [0, 0, 0, 255];
        let color2 = [255, 0, 0, 255];
        let color3 = [0, 255, 127, 255];

        let p0a = {x: 100, y: 100};
        let p1a = {x: 800, y: 200};
        let p2a = {x: 300, y: 400};
        let p3a = {x: 600, y: 300};

        this.drawBezierCurve(p0a, p1a, p2a, p3a, num_edges, color2, framebuffer);

        //Second curve
        let p0b = {x: 700, y: 500};
        let p1b = {x: 300, y: 200};
        let p2b = {x: 500, y: 400};
        let p3b = {x: 100, y: 500};

        this.drawBezierCurve(p0b, p1b, p2b, p3b, num_edges, color3, framebuffer);

        //show points
        if(this.show_points){
            for (let i = 0; i <= num_edges; i++){
                let t1 = i/num_edges;
                let x1 = (Math.pow((1-t1), 3) * p0a.x) +(3 * Math.pow((1-t1),2) * t1 * p1a.x) + (3 * Math.pow((t1),2) * (1-t1) * p2a.x) + (Math.pow(t1, 3) * p3a.x);
                let y1 = (Math.pow((1-t1), 3) * p0a.y) +(3 * Math.pow((1-t1),2) * t1 * p1a.y) + (3 * Math.pow((t1),2) * (1-t1) * p2a.y) + (Math.pow(t1, 3) * p3a.y);
                x1 = Math.trunc(x1);
                y1 = Math.trunc(y1);
                this.drawVertex({x: x1, y: y1}, color1, framebuffer);
            }
            this.drawVertex(p1a, color2, framebuffer);
            this.drawVertex(p2a, color2, framebuffer);
            for (let j = 0; j <= num_edges; j++){
                let t2 = j/num_edges;
                let x2 = (Math.pow((1-t2), 3) * p0b.x) +(3 * Math.pow((1-t2),2) * t2 * p1b.x) + (3 * Math.pow((t2),2) * (1-t2) * p2b.x) + (Math.pow(t2, 3) * p3b.x);
                let y2 = (Math.pow((1-t2), 3) * p0b.y) +(3 * Math.pow((1-t2),2) * t2 * p1b.y) + (3 * Math.pow((t2),2) * (1-t2) * p2b.y) + (Math.pow(t2, 3) * p3b.y);
                x2 = Math.trunc(x2);
                y2 = Math.trunc(y2);
                this.drawVertex({x: x2, y: y2}, color1, framebuffer);
            }
            this.drawVertex(p1b, color3, framebuffer);
            this.drawVertex(p2b, color3, framebuffer);
        }
    }

    // framebuffer:  canvas ctx image data
    drawSlide1(framebuffer) {
        let num_edges = this.num_curve_sections;

        //first circle
        let center1 = {x: 100, y: 100};
        let radius1 = 50;

        this.drawCircle(center1, radius1, num_edges, [0, 63, 63, 127], framebuffer);

        //second circle
        let center2 = {x: 400, y: 400};
        let radius2 = 200;

        this.drawCircle(center2, radius2, num_edges, [0, 127, 127, 127], framebuffer);

        //show points
        if (this.show_points){
            let color = [0, 0, 0, 255];
            for (let i = 0; i < num_edges; i++){
                let phi1 = i/num_edges * 2 * Math.PI;
                let x1 = center1.x + radius1 * Math.cos(phi1);
                let y1 = center1.y + radius1 * Math.sin(phi1);
                x1 = Math.trunc(x1);
                y1 = Math.trunc(y1);
                this.drawVertex({x: x1, y: y1}, color, framebuffer);
            }
            for (let j = 0; j < num_edges; j++){
                let phi2 = j/num_edges * 2 * Math.PI;
                let x2 = center2.x + radius2 * Math.cos(phi2);
                let y2 = center2.y + radius2 * Math.sin(phi2);
                x2 = Math.trunc(x2);
                y2 = Math.trunc(y2);
                this.drawVertex({x: x2, y: y2}, color, framebuffer);
            }
        }
    }

    // framebuffer:  canvas ctx image data
    drawSlide2(framebuffer) {
        let vertex_list1 = [{x: 200, y: 200}, {x:150, y: 325}, {x: 200, y: 400}, {x: 300, y: 400}, {x: 350, y: 275}, {x: 300, y: 200}];
        this.drawConvexPolygon(vertex_list1, [0, 127, 127, 255], framebuffer);
        
        let vertex_list2 = [{x: 500, y: 300}, {x: 450, y: 350}, {x: 450, y: 400}, {x: 500, y: 450}, {x: 550, y: 450}, {x: 600, y: 400}, {x: 600, y: 350}, {x:550, y: 300}];
        this.drawConvexPolygon(vertex_list2, [255, 0, 0, 255], framebuffer);

        if (this.show_points){
            let color = [0, 0, 0, 255];
            for (let i = 0; i < Object.keys(vertex_list1).length; i++){
                this.drawVertex(vertex_list1[i], color, framebuffer);
            }
            for (let j = 0; j < Object.keys(vertex_list2).length; j++){
                this.drawVertex(vertex_list2[j], color, framebuffer);
            }

            
        }
        
    }

    // framebuffer:  canvas ctx image data
    drawSlide3(framebuffer) {
        let num_edges = this.num_curve_sections;
        let color = [127, 0, 0, 255];
        let black = [0, 0, 0, 255];
        let white = [255, 255, 255, 255];
        //D
        let bezierDa = {x: 50, y: 200};
        let bezierDb = {x: 200, y: 200};
        let bezierDc = {x: 200, y: 400};
        let bezierDd = {x: 50, y: 400};
        this.drawLine({x: 50, y: 200}, {x: 50, y: 400}, color, framebuffer);
        this.drawBezierCurve(bezierDa, bezierDb, bezierDc, bezierDd, num_edges, color, framebuffer);

        //show points for the letter d
        if(this.show_points){
            for (let i = 0; i <= num_edges; i++){
                let t1 = i/num_edges;
                let x1 = (Math.pow((1-t1), 3) * bezierDa.x) +(3 * Math.pow((1-t1),2) * t1 * bezierDb.x) + (3 * Math.pow((t1),2) * (1-t1) * bezierDc.x) + (Math.pow(t1, 3) * bezierDd.x);
                let y1 = (Math.pow((1-t1), 3) * bezierDa.y) +(3 * Math.pow((1-t1),2) * t1 * bezierDb.y) + (3 * Math.pow((t1),2) * (1-t1) * bezierDc.y) + (Math.pow(t1, 3) * bezierDd.y);
                x1 = Math.trunc(x1);
                y1 = Math.trunc(y1);
                this.drawVertex({x: x1, y: y1}, black, framebuffer);
            }
            this.drawVertex(bezierDb, color, framebuffer);
            this.drawVertex(bezierDc, color, framebuffer);
        }

        //e
        let bezierEa = {x:280, y: 290};
        let bezierEb = {x:190, y: 300};
        let bezierEc = {x:200, y: 210};
        let bezierEd = {x:260, y: 200}; 
        let bezierEe = {x:280, y: 230};

        this.drawLine(bezierEa, bezierEc, color, framebuffer);
        this.drawBezierCurve(bezierEa, bezierEb, bezierEb, bezierEc, num_edges, color, framebuffer);
        this.drawBezierCurve(bezierEc, bezierEd, bezierEd, bezierEe, num_edges, color, framebuffer);

        //show points for the letter e
        if(this.show_points){
            for (let j = 0; j <= num_edges; j++){
                let t2 = j/num_edges;
                let x2 = (Math.pow((1-t2), 3) * bezierEa.x) +(3 * Math.pow((1-t2),2) * t2 * bezierEb.x) + (3 * Math.pow((t2),2) * (1-t2) * bezierEb.x) + (Math.pow(t2, 3) * bezierEc.x);
                let y2 = (Math.pow((1-t2), 3) * bezierEa.y) +(3 * Math.pow((1-t2),2) * t2 * bezierEb.y) + (3 * Math.pow((t2),2) * (1-t2) * bezierEb.y) + (Math.pow(t2, 3) * bezierEc.y);
                x2 = Math.trunc(x2);
                y2 = Math.trunc(y2);
                this.drawVertex({x: x2, y: y2}, black, framebuffer);
            }
            this.drawVertex(bezierEb, color, framebuffer);
            for (let k = 0; k <= num_edges; k++){
                let t3 = k/num_edges;
                let x3 = (Math.pow((1-t3), 3) * bezierEc.x) +(3 * Math.pow((1-t3),2) * t3 * bezierEd.x) + (3 * Math.pow((t3),2) * (1-t3) * bezierEd.x) + (Math.pow(t3, 3) * bezierEe.x);
                let y3 = (Math.pow((1-t3), 3) * bezierEc.y) +(3 * Math.pow((1-t3),2) * t3 * bezierEd.y) + (3 * Math.pow((t3),2) * (1-t3) * bezierEd.y) + (Math.pow(t3, 3) * bezierEe.y);
                x3 = Math.trunc(x3);
                y3 = Math.trunc(y3);
                this.drawVertex({x: x3, y: y3}, black, framebuffer);
            }
            this.drawVertex(bezierEd, color, framebuffer);
        }

        //first n
        let vertex_list1 = [{x: 300, y: 200}, {x: 300, y: 275}, {x: 325, y: 300}, {x: 375, y: 300}, {x: 400, y:275}, {x: 400, y: 200}];
        let vertex_list2 = [{x: 325, y: 200}, {x: 325, y: 275}, {x: 375, y: 275}, {x: 375, y: 200}];
        this.drawConvexPolygon(vertex_list1, color, framebuffer);
        this.drawConvexPolygon(vertex_list2, white, framebuffer);

        //show points for the first letter n
        if(this.show_points){
            for (let l = 0; l < Object.keys(vertex_list1).length; l++){
                this.drawVertex(vertex_list1[l], black, framebuffer);
            }
            for (let m = 0; m < Object.keys(vertex_list2).length; m++){
                this.drawVertex(vertex_list2[m], black, framebuffer);
            }
        }

        //second n
        let bezierNa = {x: 410, y:300};
        let bezierNb = {x:410, y: 0};
        let bezierNc = {x:420, y:500};
        let bezierNd = {x:510, y:200};
        this.drawBezierCurve(bezierNa, bezierNb, bezierNc, bezierNd, num_edges, color, framebuffer);

        //show points for the second letter n
        if(this.show_points){
            for (let n = 0; n <= num_edges; n++){
                let t4 = n/num_edges;
                let x4 = (Math.pow((1-t4), 3) * bezierNa.x) +(3 * Math.pow((1-t4),2) * t4 * bezierNb.x) + (3 * Math.pow((t4),2) * (1-t4) * bezierNc.x) + (Math.pow(t4, 3) * bezierNd.x);
                let y4 = (Math.pow((1-t4), 3) * bezierNa.y) +(3 * Math.pow((1-t4),2) * t4 * bezierNb.y) + (3 * Math.pow((t4),2) * (1-t4) * bezierNc.y) + (Math.pow(t4, 3) * bezierNd.y);
                x4 = Math.trunc(x4);
                y4 = Math.trunc(y4);
                this.drawVertex({x: x4, y: y4}, black, framebuffer);
            }
            this.drawVertex(bezierNb, color, framebuffer);
            this.drawVertex(bezierNc, color, framebuffer);
        }

        //i
        let radius = 15;
        let center1 = {x: 550, y: 215};
        let center2 = {x: 550, y: 245};
        let center3 = {x: 550, y: 275};
        let center4 = {x: 550, y: 315};
        this.drawCircle(center1, radius, num_edges, color, framebuffer);
        this.drawCircle(center2, radius, num_edges, color, framebuffer);
        this.drawCircle(center3, radius, num_edges, color, framebuffer);
        this.drawCircle(center4, 10, num_edges, color, framebuffer);

        //show points for the letter i
        if(this.show_points){
            for (let o = 0; o < num_edges; o++){
                let phi = o/num_edges * 2 * Math.PI;
                let x5 = center1.x + radius * Math.cos(phi);
                let y5 = center1.y + radius * Math.sin(phi);
                x5 = Math.trunc(x5);
                y5 = Math.trunc(y5);
                this.drawVertex({x: x5, y: y5}, black, framebuffer);

                let x6 = center2.x + radius * Math.cos(phi);
                let y6 = center2.y + radius * Math.sin(phi);
                x6 = Math.trunc(x6);
                y6 = Math.trunc(y6);
                this.drawVertex({x: x6, y: y6}, black, framebuffer);

                let x7 = center3.x + radius * Math.cos(phi);
                let y7 = center3.y + radius * Math.sin(phi);
                x7 = Math.trunc(x7);
                y7 = Math.trunc(y7);
                this.drawVertex({x: x7, y: y7}, black, framebuffer);

                let x8 = center4.x + 10 * Math.cos(phi);
                let y8 = center4.y + 10 * Math.sin(phi);
                x8 = Math.trunc(x8);
                y8 = Math.trunc(y8);
                this.drawVertex({x: x8, y: y8}, black, framebuffer);
            }
        }

        //s
        let bezierSa = {x:700, y: 300};
        let bezierSb = {x:600, y: 300};
        let bezierSc = {x:700, y: 200};
        let bezierSd = {x:600, y: 200};
        this.drawBezierCurve(bezierSa, bezierSb, bezierSc, bezierSd, num_edges, color, framebuffer);

        //show points for the letter s
        if (this.show_points){
            for (let p = 0; p <= num_edges; p++){
                let t9 = p/num_edges;
                let x9 = (Math.pow((1-t9), 3) * bezierSa.x) +(3 * Math.pow((1-t9),2) * t9 * bezierSb.x) + (3 * Math.pow((t9),2) * (1-t9) * bezierSc.x) + (Math.pow(t9, 3) * bezierSd.x);
                let y9 = (Math.pow((1-t9), 3) * bezierSa.y) +(3 * Math.pow((1-t9),2) * t9 * bezierSb.y) + (3 * Math.pow((t9),2) * (1-t9) * bezierSc.y) + (Math.pow(t9, 3) * bezierSd.y);
                x9 = Math.trunc(x9);
                y9 = Math.trunc(y9);
                this.drawVertex({x: x9, y: y9}, black, framebuffer);
            }
            this.drawVertex(bezierSb, color, framebuffer);
            this.drawVertex(bezierSc, color, framebuffer);
        }

    }

    // p0:           object {x: __, y: __}
    // p1:           object {x: __, y: __}
    // p2:           object {x: __, y: __}
    // p3:           object {x: __, y: __}
    // num_edges:    int
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawBezierCurve(p0, p1, p2, p3, num_edges, color, framebuffer) {
        for (let i = 0; i < num_edges; i++){
            let t1 = i/num_edges;
            let t2 = (i+1)/num_edges;
            let x1 = (Math.pow((1-t1), 3) * p0.x) +(3 * Math.pow((1-t1),2) * t1 * p1.x) + (3 * Math.pow((t1),2) * (1-t1) * p2.x) + (Math.pow(t1, 3) * p3.x);
            let y1 = (Math.pow((1-t1), 3) * p0.y) +(3 * Math.pow((1-t1),2) * t1 * p1.y) + (3 * Math.pow((t1),2) * (1-t1) * p2.y) + (Math.pow(t1, 3) * p3.y);
            let x2 = (Math.pow((1-t2), 3) * p0.x) +(3 * Math.pow((1-t2),2) * t2 * p1.x) + (3 * Math.pow((t2),2) * (1-t2) * p2.x) + (Math.pow(t2, 3) * p3.x);
            let y2 = (Math.pow((1-t2), 3) * p0.y) +(3 * Math.pow((1-t2),2) * t2 * p1.y) + (3 * Math.pow((t2),2) * (1-t2) * p2.y) + (Math.pow(t2, 3) * p3.y);

            x1 = Math.trunc(x1);
            y1 = Math.trunc(y1);
            x2 = Math.trunc(x2);
            y2 = Math.trunc(y2);

            this.drawLine({x: x1, y: y1}, {x: x2, y: y2}, color, framebuffer);
        }
        
    }

    // center:       object {x: __, y: __}
    // radius:       int
    // num_edges:    int
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawCircle(center, radius, num_edges, color, framebuffer) {
        for (let i = 0; i < num_edges; i++){

            let phi1 = i/num_edges * 2 * Math.PI;
            let phi2 = (i+1)/num_edges * 2 * Math.PI;

            let x1 = center.x + radius * Math.cos(phi1);
            let y1 = center.y + radius * Math.sin(phi1);
            let x2 = center.x + radius * Math.cos(phi2);
            let y2 = center.y + radius * Math.sin(phi2);

            x1 = Math.trunc(x1);
            y1 = Math.trunc(y1);
            x2 = Math.trunc(x2);
            y2 = Math.trunc(y2);

            this.drawLine({x: x1, y: y1}, {x: x2, y: y2}, color, framebuffer);
        
            
        }
        
    }
    
    // vertex_list:  array of object [{x: __, y: __}, {x: __, y: __}, ..., {x: __, y: __}]
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawConvexPolygon(vertex_list, color, framebuffer) {
        let v0 = vertex_list[0];
        let l = Object.keys(vertex_list).length-1;
        const hold_list = structuredClone(vertex_list);
        for(let i = 1; i < l; i++){
            const list = structuredClone(hold_list);
            let v1 = list[i];
            let v2 = list[i+1];
            this.drawTriangle(v0, v1, v2, color, framebuffer); 
           
        }
    }
    
    // v:            object {x: __, y: __}
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawVertex(v, color, framebuffer) {
        let c = v.x;
        let d = v.y;
        this.drawLine({x:  c-5, y:  d}, {x:  c+5, y:  d}, color, framebuffer);
        this.drawLine({x:  c, y:  d-5}, {x:  c, y:  d+5}, color, framebuffer);
    }
    
    /***************************************************************
     ***       Basic Line and Triangle Drawing Routines          ***
     ***       (code provided from in-class activities)          ***
     ***************************************************************/
    pixelIndex(x, y, framebuffer) {
	    return 4 * y * framebuffer.width + 4 * x;
    }
    
    setFramebufferColor(framebuffer, px, color) {
	    framebuffer.data[px + 0] = color[0];
	    framebuffer.data[px + 1] = color[1];
	    framebuffer.data[px + 2] = color[2];
	    framebuffer.data[px + 3] = color[3];
    }
    
    swapPoints(a, b) {
        let tmp = {x: a.x, y: a.y};
        a.x = b.x;
        a.y = b.y;
        b.x = tmp.x;
        b.y = tmp.y;
    }

    drawLine(p0, p1, color, framebuffer) {
        if (Math.abs(p1.y - p0.y) <= Math.abs(p1.x - p0.x)) { // |m| <= 1
            if (p0.x < p1.x) {
                this.drawLineLow(p0.x, p0.y, p1.x, p1.y, color, framebuffer);
            }
            else {
                this.drawLineLow(p1.x, p1.y, p0.x, p0.y, color, framebuffer);
            }
        }
        else {                                        // |m| > 1
            if (p0.y < p1.y) {
                this.drawLineHigh(p0.x, p0.y, p1.x, p1.y, color, framebuffer);
            }
            else {
                this.drawLineHigh(p1.x, p1.y, p0.x, p0.y, color, framebuffer);
            }
        }
    }

    drawLineLow(x0, y0, x1, y1, color, framebuffer) {
        let A = y1 - y0;
        let B = x0 - x1;
        let iy = 1;
        if (A < 0) {
            iy = -1;
            A *= -1;
        }
        let D = 2 * A + B;
        let x = x0;
        let y = y0;
        let px;
        while (x <= x1)
        {
            px = this.pixelIndex(x, y, framebuffer);
            this.setFramebufferColor(framebuffer, px, color);
            x += 1;
            if (D <= 0)
            {
                D += 2 * A;
            }
            else
            {
                D += 2 * A + 2 * B;
                y += iy;
            }
        }
    }

    drawLineHigh(x0, y0, x1, y1, color, framebuffer) {
        let A = x1 - x0;
        let B = y0 - y1;
        let ix = 1;
        if (A < 0) {
            ix = -1;
            A *= -1;
        }
        let D = 2 * A + B;
        let x = x0;
        let y = y0;
        let px;
        while (y <= y1)
        {
            px = this.pixelIndex(x, y, framebuffer);
            this.setFramebufferColor(framebuffer, px, color);
            y += 1;
            if (D <= 0)
            {
                D += 2 * A;
            }
            else
            {
                D += 2 * A + 2 * B;
                x += ix;
            }
        }
    }
    
    drawTriangle(p0, p1, p2, color, framebuffer) {
        // Sort points in ascending y order
        if (p1.y < p0.y) this.swapPoints(p0, p1);
        if (p2.y < p0.y) this.swapPoints(p0, p2);
        if (p2.y < p1.y) this.swapPoints(p1, p2);
        
        // Edge coherence triangle algorithm
        // Create initial edge table
        let edge_table = [
            {x: p0.x, inv_slope: (p1.x - p0.x) / (p1.y - p0.y)}, // edge01
            {x: p0.x, inv_slope: (p2.x - p0.x) / (p2.y - p0.y)}, // edge02
            {x: p1.x, inv_slope: (p2.x - p1.x) / (p2.y - p1.y)}  // edge12
        ];
        
        // Do cross product to determine if pt1 is to the right/left of edge02
        let v01 = {x: p1.x - p0.x, y: p1.y - p0.y};
        let v02 = {x: p2.x - p0.x, y: p2.y - p0.y};
        let p1_right = ((v01.x * v02.y) - (v01.y * v02.x)) >= 0;
        
        // Get the left and right edges from the edge table (lower half of triangle)
        let left_edge, right_edge;
        if (p1_right) {
            left_edge = edge_table[1];
            right_edge = edge_table[0];
        }
        else {
            left_edge = edge_table[0];
            right_edge = edge_table[1];
        }
        // Draw horizontal lines (lower half of triangle)
        for (let y = p0.y; y < p1.y; y++) {
            let left_x = parseInt(left_edge.x) + 1;
            let right_x = parseInt(right_edge.x);
            if (left_x <= right_x) { 
                this.drawLine({x: left_x, y: y}, {x: right_x, y: y}, color, framebuffer);
            }
            left_edge.x += left_edge.inv_slope;
            right_edge.x += right_edge.inv_slope;
        }
        
        // Get the left and right edges from the edge table (upper half of triangle) - note only one edge changes
        if (p1_right) {
            right_edge = edge_table[2];
        }
        else {
            left_edge = edge_table[2];
        }
        // Draw horizontal lines (upper half of triangle)
        for (let y = p1.y; y < p2.y; y++) {
            let left_x = parseInt(left_edge.x) + 1;
            let right_x = parseInt(right_edge.x);
            if (left_x <= right_x) {
                this.drawLine({x: left_x, y: y}, {x: right_x, y: y}, color, framebuffer);
            }
            left_edge.x += left_edge.inv_slope;
            right_edge.x += right_edge.inv_slope;
        }
    }
};
