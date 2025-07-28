function AboutPage() {
  return (
    <div>
      <h2>About</h2>
      <h1>延迟加载示例</h1>
      <p>
        此示例演示了如何延迟加载路由元素和
        甚至按需路由层次结构的整个部分。为了得到完整的
        该演示的效果，请务必打开“网络”选项卡并观看新的
        当您浏览时，捆绑包会动态加载。
      </p>

      <p>
        在您单击链接之前，不会加载“关于”页面。当你这样做时，
        React.Suspensefallback 在代码执行时呈现 通过动态 import()
        语句加载。一旦代码 加载后，后备将被该页面的实际代码替换。
      </p>

      <p>
        “仪表板”页面执行相同的操作，但更进一步 进一步<em>动态定义额外的路由</em>
        一旦页面 负载！由于 React Router 允许你将路由声明为
        Route元素，可以轻松定义更多路由 通过在任何地方放置额外的 Routes 元素
        元素树的更下方。只要确保父路由以 结尾即可 * 就像 Route
        path="dashboard/*" 中的 这个案例。
      </p>
    </div>
  );
}

export default AboutPage;
