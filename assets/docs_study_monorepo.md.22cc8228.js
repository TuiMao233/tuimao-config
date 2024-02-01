import{_ as o,o as e,c as a,a as n}from"./app.3a9b9990.js";const p="/assets/lerna-work-step.3520abdd.png",_=JSON.parse('{"title":"什么是 Monorepo?","description":"","frontmatter":{},"headers":[{"level":2,"title":"MultiRepo 存在的问题","slug":"multirepo-存在的问题","link":"#multirepo-存在的问题","children":[{"level":3,"title":"代码复用","slug":"代码复用","link":"#代码复用","children":[]},{"level":3,"title":"版本管理","slug":"版本管理","link":"#版本管理","children":[]},{"level":3,"title":"项目基建","slug":"项目基建","link":"#项目基建","children":[]}]},{"level":2,"title":"Monorepo 的收益","slug":"monorepo-的收益","link":"#monorepo-的收益","children":[]},{"level":2,"title":"Monorepo 的落地","slug":"monorepo-的落地","link":"#monorepo-的落地","children":[]},{"level":2,"title":"选择 Monorepo 方法和工具","slug":"选择-monorepo-方法和工具","link":"#选择-monorepo-方法和工具","children":[]}],"relativePath":"docs/study/monorepo.md","lastUpdated":1706771416000}'),r={name:"docs/study/monorepo.md"},s=n(`<h1 id="什么是-monorepo" tabindex="-1">什么是 Monorepo? <a class="header-anchor" href="#什么是-monorepo" aria-hidden="true">#</a></h1><p>Monorepo 其实不是一个新的概念，在软件工程领域，它已经有着十多年的历史了。概念上很好理解，就是把<strong>多个项目</strong>放在一个<strong>仓库</strong>里面，相对立的是传统的 MultiRepo 模式，即每个项目对应一个单独的仓库来分散管理。</p><p><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/75a56317bdf94794a8b29f6cd184c888~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp" alt="image"></p><p>现代的前端工程已经越来越离不开 Monorepo 了，无论是业务代码还是工具库，越来越多的项目已经采用 Monorepo 的方式来进行开发。Google 宁愿把所有的代码都放在一个 Monorepo 工程下面，Vue 3、Yarn、Npm7 等等知名开源项目的源码也是采用 Monorepo 的方式来进行管理的。</p><p>一般 Monorepo 的目录如下所示，在 packages 存放多个子项目，并且每个子项目都有自己的</p><p><code>package.json</code>:</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;">├── packages</span></span>
<span class="line"><span style="color:#A6ACCD;">|   ├── pkg1</span></span>
<span class="line"><span style="color:#A6ACCD;">|   |   ├── package.json</span></span>
<span class="line"><span style="color:#A6ACCD;">|   ├── pkg2</span></span>
<span class="line"><span style="color:#A6ACCD;">|   |   ├── package.json</span></span>
<span class="line"><span style="color:#A6ACCD;">├── package.json</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h2 id="multirepo-存在的问题" tabindex="-1">MultiRepo 存在的问题 <a class="header-anchor" href="#multirepo-存在的问题" aria-hidden="true">#</a></h2><h3 id="代码复用" tabindex="-1">代码复用 <a class="header-anchor" href="#代码复用" aria-hidden="true">#</a></h3><p>在维护多个项目的时候，有一些逻辑很有可能会被多次用到，比如一些基础的组件、工具函数，或者一些配置，你可能会想: 要不把代码直接 copy 过来，多省事儿！但有个问题是，如果这些代码出现 bug、或者需要做一些调整的时候，就得修改多份，维护成本越来越高。</p><p>那如何来解决这个问题呢？比较好的方式是将公共的逻辑代码抽取出来，作为一个 npm 包进行发布，一旦需要改动，只需要改动一份代码，然后 publish 就行了。</p><p>但这并不能完美的解决问题？举个例子，比如引入了 <code>1.1.0</code> 版本的 A 包，某个工具函数出现问题了，你需要做这些事情：</p><ol><li>去修改一个工具函数的代码</li><li>发布<code>1.1.1</code>版本的新包</li><li>项目中安装新版本的 A</li></ol><p>可能只是改了一行代码，需要走这么多流程。然而开发阶段是很难保证不出 bug 的，如果有个按钮需要改个样式，又需要把上面的流程重新走一遍......停下来想想，这些重复的步骤真的是必须的吗？只是想复用一下代码，为什么每次修改代码都这么复杂？</p><p>上述的问题其实是 MultiRepo普遍存在的问题，因为不同的仓库工作区的割裂，导致复用代码的成本很高，开发调试的流程繁琐，甚至在基础库频繁改动的情况下让人感到很抓狂，体验很差。</p><h3 id="版本管理" tabindex="-1">版本管理 <a class="header-anchor" href="#版本管理" aria-hidden="true">#</a></h3><p>在 MultiRepo 的开发方式下，依赖包的版本管理有时候是一个特别玄学的问题。比如说刚开始一个工具包版本是 <code>v1.0.0</code>，有诸多项目都依赖于这个工具包，但在某个时刻，这个工具包发了一个 break change 版本，和原来版本的 API 完全不兼容。而事实上有些项目并没有升级这个依赖，导致一些莫名的报错。</p><p>当项目多了之后，很容易出现这种依赖更新不及时的情况。这又是一个痛点。</p><h3 id="项目基建" tabindex="-1">项目基建 <a class="header-anchor" href="#项目基建" aria-hidden="true">#</a></h3><p>由于在 MultiRepo 当中，各个项目的工作流是割裂的，因此每个项目需要单独配置开发环境、配置 CI 流程、配置部署发布流程等等，甚至每个项目都有自己单独的一套脚手架工具。</p><p>其实，很容易发现这些项目里的很多基建的逻辑都是重复的，如果是 10 个项目，就需要维护 10 份基建的流程，逻辑重复不说，各个项目间存在构建、部署和发布的规范不能统一的情况，这样维护起来就更加麻烦了。</p><h2 id="monorepo-的收益" tabindex="-1">Monorepo 的收益 <a class="header-anchor" href="#monorepo-的收益" aria-hidden="true">#</a></h2><p>首先是<strong>工作流的一致性</strong>，由于所有的项目放在一个仓库当中，复用起来非常方便，如果有依赖的代码变动，那么用到这个依赖的项目当中会立马感知到。并且所有的项目都是使用最新的代码，不会产生其它项目版本更新不及时的情况。</p><p>其次是<strong>项目基建成本的降低</strong>，所有项目复用一套标准的工具和规范，无需切换开发环境，如果有新的项目接入，也可以直接复用已有的基建流程，比如 CI 流程、构建和发布流程。这样只需要很少的人来维护所有项目的基建，维护成本也大大减低。</p><p>再者，<strong>团队协作也更加容易</strong>，一方面大家都在一个仓库开发，能够方便地共享和复用代码，方便检索项目源码，另一方面，git commit 的历史记录也支持以功能为单位进行提交，之前对于某个功能的提交，需要改好几个仓库，提交多个 commit，现在只需要提交一次，简化了 commit 记录，方便协作。</p><h2 id="monorepo-的落地" tabindex="-1">Monorepo 的落地 <a class="header-anchor" href="#monorepo-的落地" aria-hidden="true">#</a></h2><p>刚刚说了这么多 Monorepo 的好处，可是我还是不知道怎么用啊！是直接把所有的代码全部搬到一个仓库就可以了吗?</p><p>当然不是，在实际场景来落地 Monorepo，需要一套完整的工程体系来进行支撑，因为基于 Monorepo 的项目管理，绝不是仅仅代码放到一起就可以的，还需要考虑项目间依赖分析、依赖安装、构建流程、测试流程、CI 及发布流程等诸多工程环节，同时还要考虑项目规模到达一定程度后的性能问题，比如项目构建/测试时间过长需要进行增量构建/测试、按需执行 CI等等，在实现全面工程化能力的同时，也需要兼顾到性能问题。</p><p>因此，要想从零开始定制一套完善的 Monorepo 的工程化工具，是一件难度很高的事情。不过社区已经提供了一些比较成熟的方案，我们可以拿来进行定制，或者对于一些上层的方案直接拿来使用。</p><p>其中比较底层的方案比如 lerna，封装了 Monorepo 中的依赖安装、脚本批量执行等等基本的功能，但没有一套构建、测试、部署的工具链，整体 Monorepo 功能比较弱，但要用到业务项目当中，往往需要基于它进行顶层能力的封装，提供全面工程能力的支撑。</p><p>以前的项目运行流程图：</p><p><img src="`+p+'" alt="image"></p><h2 id="选择-monorepo-方法和工具" tabindex="-1">选择 Monorepo 方法和工具 <a class="header-anchor" href="#选择-monorepo-方法和工具" aria-hidden="true">#</a></h2><p><a href="https://github.com/practicajs/practica/blob/main/docs/docs/decisions/monorepo.md?plain=1" target="_blank" rel="noreferrer">https://github.com/practicajs/practica/blob/main/docs/docs/decisions/monorepo.md?plain=1</a></p>',34),t=[s];function l(i,c,d,h,m,g){return e(),a("div",null,t)}const b=o(r,[["render",l]]);export{_ as __pageData,b as default};
