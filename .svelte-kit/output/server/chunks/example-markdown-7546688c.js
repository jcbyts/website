import { c as create_ssr_component } from "./app-1a513ba3.js";
import "@sveltejs/kit/ssr";
const Example_markdown = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<p><strong>Note that despite this file having an md extension, it can support all Svelte language features (like scripting). Do not import untrusted or user-created markdown files.</strong></p>
<p><em>This markdown sample was taken from <a href="${"https://gist.github.com/rt2zz/e0a1d6ab2682d2c47746950b84c0b6ee"}" rel="${"nofollow"}">here</a>.</em></p>
<h1 id="${"an-h1-header"}">An h1 header</h1>
<p>Paragraphs are separated by a blank line.</p>
<p>2nd paragraph. <em>Italic</em>, <strong>bold</strong>, and <code>monospace</code>. Itemized lists
look like:</p>
<ul><li>this one</li>
<li>that one</li>
<li>the other one</li></ul>
<p>Note that \u2014 not considering the asterisk \u2014 the actual text
content starts at 4-columns in.</p>
<blockquote><p>Block quotes are
written like so.</p>
<p>They can span multiple paragraphs,
if you like.</p></blockquote>
<p>Use 3 dashes for an em-dash. Use 2 dashes for ranges (ex., \u201Cit\u2019s all
in chapters 12\u201314\u201D). Three dots \u2026 will be converted to an ellipsis.
Unicode is supported. \u263A</p>
<h2 id="${"an-h2-header"}">An h2 header</h2>
<p>Here\u2019s a numbered list:</p>
<ol><li>first item</li>
<li>second item</li>
<li>third item</li></ol>
<p>By the way, you can write code in delimited blocks:</p>
<pre class="${"language-undefined"}"><!-- HTML_TAG_START -->${`<code class="language-undefined">define foobar() &#123;
    print &quot;Welcome to flavor country!&quot;;
&#125;</code>`}<!-- HTML_TAG_END --></pre>
<p>(which makes copying &amp; pasting easier). You can optionally mark the
delimited block for syntax highlighting when you include the CSS for a Prism theme:</p>
<pre class="${"language-python"}"><!-- HTML_TAG_START -->${`<code class="language-python"><span class="token keyword">import</span> time
<span class="token comment"># Quick, count to ten!</span>
<span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token comment"># (but not *too* quick)</span>
    time<span class="token punctuation">.</span>sleep<span class="token punctuation">(</span><span class="token number">0.5</span><span class="token punctuation">)</span>
    <span class="token keyword">print</span> i</code>`}<!-- HTML_TAG_END --></pre>
<h3 id="${"an-h3-header"}">An h3 header</h3>
<p>Now, a nested list:</p>
<ol><li>First, get these ingredients:<ul><li>carrots</li>
<li>celery</li>
<li>lentils</li></ul></li>
<li>Boil some water.</li>
<li>Dump everything in the pot and follow
this algorithm:<pre class="${"language-undefined"}"><!-- HTML_TAG_START -->${`<code class="language-undefined">find wooden spoon
uncover pot
stir
cover pot
balance wooden spoon precariously on pot handle
wait 10 minutes
goto first step (or shut off burner when done)</code>`}<!-- HTML_TAG_END --></pre>Do not bump wooden spoon or it will fall.</li></ol>
<p>Notice again how text always lines up on 4-space indents (including
that last line which continues item 3 above).</p>
<p>Here\u2019s a link to <a href="${"http://foo.bar"}" rel="${"nofollow"}">a website</a> and one to this site\u2019s <a href="${"/"}">home page</a>. Because the <code>rehype-slug</code> and <code>rehype-autolink-headings</code> plugins have been set up for you, <a href="${"#an-h2-header"}">this will link to a section heading in the current
doc</a>.</p>
<p>A horizontal rule follows.</p>
<hr>
<p>And note that you can backslash-escape any punctuation characters
which you wish to be displayed literally, ex.: \`foo\`, *bar*, etc.</p>
<p>This mention \u2014 <a href="${"https://github.com/svelte-add"}"><strong>@svelte-add</strong></a> \u2014 will turn into a link to the <code>svelte-add</code> GitHub page because the <code>remark-github</code> plugin is setup.</p>`;
});
export { Example_markdown as default };
