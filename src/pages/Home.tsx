import Orb from '@components/Orb';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* 左侧内容区 */}
      <div className="flex-1 flex flex-col justify-center p-8">
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 text-transparent bg-clip-text">
              欢迎来到我的世界
            </span>
          </h1>
          <p className="text-2xl mb-8">
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-transparent bg-clip-text">
              探索、发现、创造
            </span>
          </p>

          {/* 可以在这里添加更多内容，如简介或按钮 */}
          <p className="text-gray-700 dark:text-gray-200 mb-8 leading-relaxed">
            这里是我的个人空间，记录着我的思考、创作和分享。
            无论是技术探索还是生活感悟，都希望能给你带来一些启发。
          </p>

          <div className="flex gap-4">
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity shadow-md">
              探索更多
            </button>
            <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shadow-md">
              了解我
            </button>
          </div>
        </div>
      </div>

      {/* 右侧 Orb 区域 */}
      <div className="md:w-2/5 h-[500px] md:h-screen relative">
        <div className="w-full h-full">
          <Orb hoverIntensity={0.5} rotateOnHover={true} hue={0} forceHoverState={false} />
        </div>
      </div>
    </div>
  );
};

export default Home;
