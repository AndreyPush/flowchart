import{a as i,ap as o}from"./index-DZ6-lXa1.js";const x=(e,t)=>{const r=e.append("rect");if(r.attr("x",t.x),r.attr("y",t.y),r.attr("fill",t.fill),r.attr("stroke",t.stroke),r.attr("width",t.width),r.attr("height",t.height),t.name&&r.attr("name",t.name),t.rx!==void 0&&r.attr("rx",t.rx),t.ry!==void 0&&r.attr("ry",t.ry),t.attrs!==void 0)for(const a in t.attrs)r.attr(a,t.attrs[a]);return t.class!==void 0&&r.attr("class",t.class),r},c=(e,t)=>{const r={x:t.startx,y:t.starty,width:t.stopx-t.startx,height:t.stopy-t.starty,fill:t.fill,stroke:t.stroke,class:"rect"};x(e,r).lower()},h=(e,t)=>{const r=t.text.replace(o," "),a=e.append("text");a.attr("x",t.x),a.attr("y",t.y),a.attr("class","legend"),a.style("text-anchor",t.anchor),t.class!==void 0&&a.attr("class",t.class);const s=a.append("tspan");return s.attr("x",t.x+t.textMargin*2),s.text(r),a},y=(e,t,r,a)=>{const s=e.append("image");s.attr("x",t),s.attr("y",r);const n=i.sanitizeUrl(a);s.attr("xlink:href",n)},p=(e,t,r,a)=>{const s=e.append("use");s.attr("x",t),s.attr("y",r);const n=i.sanitizeUrl(a);s.attr("xlink:href",`#${n}`)},d=()=>({x:0,y:0,width:100,height:100,fill:"#EDF2AE",stroke:"#666",anchor:"start",rx:0,ry:0}),f=()=>({x:0,y:0,width:100,height:100,"text-anchor":"start",style:"#666",textMargin:0,rx:0,ry:0,tspan:!0});export{h as d,d as g,y as h,x as l,f as m,c as x,p as y};
