import{S as N,i as O,s as P,e as p,t as A,k as C,c as m,a as v,g as S,d as f,n as T,b as k,f as w,D as d,h as H,Y as V,E as R,a1 as $,a0 as z}from"../chunks/vendor-0fd8ff1a.js";function Y(h,e,s){const l=h.slice();return l[2]=e[s].slug,l[3]=e[s].title,l[4]=e[s].date,l[5]=e[s].description,l}function q(h){let e,s,l=h[5]+"",o;return{c(){e=p("section"),s=p("p"),o=A(l),this.h()},l(t){e=m(t,"SECTION",{class:!0});var n=v(e);s=m(n,"P",{});var u=v(s);o=S(u,l),u.forEach(f),n.forEach(f),this.h()},h(){k(e,"class","mt-3")},m(t,n){w(t,e,n),d(e,s),d(s,o)},p(t,n){n&1&&l!==(l=t[5]+"")&&H(o,l)},d(t){t&&f(e)}}}function B(h,e){let s,l,o,t,n=e[3]+"",u,E,a,r,c=e[1](new Date(e[4]))+"",g,j,y,i=e[5]&&q(e);return{key:h,first:null,c(){s=p("article"),l=p("header"),o=p("a"),t=p("h3"),u=A(n),a=C(),r=p("small"),g=A(c),j=C(),i&&i.c(),y=C(),this.h()},l(b){s=m(b,"ARTICLE",{class:!0});var _=v(s);l=m(_,"HEADER",{});var D=v(l);o=m(D,"A",{href:!0});var I=v(o);t=m(I,"H3",{class:!0});var L=v(t);u=S(L,n),L.forEach(f),I.forEach(f),a=T(D),r=m(D,"SMALL",{class:!0});var M=v(r);g=S(M,c),M.forEach(f),D.forEach(f),j=T(_),i&&i.l(_),y=T(_),_.forEach(f),this.h()},h(){k(t,"class","mt-0 text-gray-900"),k(o,"href",E="/blog/"+e[2]),k(r,"class","font-mono text-gray-500 text-sm"),k(s,"class","bg-white py-6 md:py-10 px-5 md:px-14 shadow-lg shadow-blue-50 hover:shadow-blue-100 transition-all transform hover:-translate-y-1"),this.first=s},m(b,_){w(b,s,_),d(s,l),d(l,o),d(o,t),d(t,u),d(l,a),d(l,r),d(r,g),d(s,j),i&&i.m(s,null),d(s,y)},p(b,_){e=b,_&1&&n!==(n=e[3]+"")&&H(u,n),_&1&&E!==(E="/blog/"+e[2])&&k(o,"href",E),_&1&&c!==(c=e[1](new Date(e[4]))+"")&&H(g,c),e[5]?i?i.p(e,_):(i=q(e),i.c(),i.m(s,y)):i&&(i.d(1),i=null)},d(b){b&&f(s),i&&i.d()}}}function G(h){let e,s,l,o,t=[],n=new Map,u=h[0].filter(F);const E=a=>a[2];for(let a=0;a<u.length;a+=1){let r=Y(h,u,a),c=E(r);n.set(c,t[a]=B(c,r))}return{c(){e=p("h1"),s=A("Thoughts"),l=C(),o=p("div");for(let a=0;a<t.length;a+=1)t[a].c();this.h()},l(a){e=m(a,"H1",{});var r=v(e);s=S(r,"Thoughts"),r.forEach(f),l=T(a),o=m(a,"DIV",{class:!0});var c=v(o);for(let g=0;g<t.length;g+=1)t[g].l(c);c.forEach(f),this.h()},h(){k(o,"class","space-y-12 -mx-14")},m(a,r){w(a,e,r),d(e,s),w(a,l,r),w(a,o,r);for(let c=0;c<t.length;c+=1)t[c].m(o,null)},p(a,[r]){r&3&&(u=a[0].filter(F),t=V(t,r,E,1,a,u,n,o,z,B,null,Y))},i:R,o:R,d(a){a&&f(e),a&&f(l),a&&f(o);for(let r=0;r<t.length;r+=1)t[r].d()}}}async function Q({page:h,fetch:e,session:s,context:l}){const o="/blog.json",t=await e(o);return t.ok?{props:{posts:await t.json()}}:{status:t.status,error:new Error(`Could not load ${o}`)}}const F=h=>!h.draft&&h.slug;function J(h,e,s){let{posts:l=[]}=e;const o=$("%b %e, %Y");return h.$$set=t=>{"posts"in t&&s(0,l=t.posts)},[l,o]}class U extends N{constructor(e){super();O(this,e,J,G,P,{posts:0})}}export{U as default,Q as load};