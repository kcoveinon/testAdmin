

window.onload=function(){

	//var node = document.createElement("style");
	//node.id = "iframeStylePreview";
	
	//node.setAttribute("class", "iframeStylePreview");
	//node.async = false;
	//document.getElementsByTagName("head")[0].appendChild(node);


	function listener(event){
		/*if ( event.origin !== "http://localhost/vroomAdmin_recode/public" )
		    return;*/
		//alert("received: "+event.data);

		var data = JSON.parse(event.data);

		switch(data.action) {
		    case 'changeStyle':
		    
		    	document.getElementById("iframeStylePreview").innerHTML = data.content;

		        break;
		    case 'changeHtml':

		    	document.querySelectorAll('[html-builder-type='+data.content.type+']')[0].innerHTML = data.content.html

		        break;
		}

		
		//console.log(data);
	}

	if (window.addEventListener){
		addEventListener("message", listener, false)
	} else {
		attachEvent("onmessage", listener)
	}

	var htmlBuilder = document.getElementsByTagName('html-builder');

	for(var i=0; i<htmlBuilder.length; i++){

		var data = {
			'action':'getInitialHtml',
			'content':htmlBuilder[i].getAttribute('html-builder-type'),
		}

		//window.parent.postMessage(JSON.stringify(data), 'http://localhost/vroomAdmin_recode/public');
		window.parent.postMessage(JSON.stringify(data), '*'); // I'm using '*' for now but we should define the url

		htmlBuilder[i].onmouseenter = function(){
			htmlBuilderHighlight = document.createElement('html-builder-highlight');
			htmlBuilderHighlight.setAttribute("style","height:"+this.offsetHeight.toString()+"px;top:"+this.offsetTop.toString()+"px;")
			/*
			htmlBuilderHighlight.style.height = this.offsetHeight;
			htmlBuilderHighlight.style.top = this.getBoundingClientRect().top;
			*/
			//console.log("height:"+this.offsetHeight.toString()+";top:"+(this.getBoundingClientRect().top-this.offsetHeight).toString()+";");
			this.appendChild(htmlBuilderHighlight);
		};

		htmlBuilder[i].onmouseleave = function(){
			if(this.getElementsByTagName('html-builder-highlight')[0]!=null){
				this.getElementsByTagName('html-builder-highlight')[0].remove();
			}
				
		};

		htmlBuilder[i].onclick = function(){
			var data = {
				'action':'requestHtmlBuilder',
				'content':this.getAttribute('html-builder-type'),
			}

			// window.parent.postMessage(JSON.stringify(data), 'http://localhost/vroomAdmin_recode/public');
			window.parent.postMessage(JSON.stringify(data), '*');  // I'm using '*' for now but we should define the url

		};



	}
	/*

	function hideConfigurator(){

		var data = {
			'action':'hideConfigurator'
		}

		// window.parent.postMessage(JSON.stringify(data), 'http://localhost/vroomAdmin_recode/public');
		window.parent.postMessage(JSON.stringify(data), '*');  // I'm using '*' for now but we should define the url

	}

	mouseIdleListenerTimeout = setTimeout(hideConfigurator, 1500);

	window.onmousemove = function(){
		clearTimeout(mouseIdleListenerTimeout);

		var data = {
			'action':'showConfigurator'
		}

		// window.parent.postMessage(JSON.stringify(data), 'http://localhost/vroomAdmin_recode/public');
		window.parent.postMessage(JSON.stringify(data), '*');  // I'm using '*' for now but we should define the url
		
		mouseIdleListenerTimeout = setTimeout(hideConfigurator, 1500);
	};

	window.onmouseleave = function(){
		console.log('testing');
		mouseIdleListenerTimeout = '';
	}

	window.onmouseenter = function(){
		mouseIdleListenerTimeout = setTimeout(hideConfigurator, 1500);
	}

	*/
}


