async function request(method, params) {
  return new Promise((resolve, reject) => {
    const httpMethod = $httpClient[method.toLowerCase()];
    httpMethod(params, (error, response, data) => {
      resolve({ error, response, data });
    });
  });
}

async function main() {
  // 访问一个仅在特定地区（如美国、香港）提供的剧集 ID
  // 如果能访问到 200，说明是完整版；如果重定向或 404，通常是自制剧或未解锁
  const { error, response, data } = await request(
    "GET",
    "https://www.netflix.com/title/81215153"
  );

  if (error) {
    $done({
      content: "Network Error",
      backgroundColor: "",
    });
    return;
  }

  if (response.status === 200) {
    // 检查页面内容是否包含该剧集 ID，确认不是被重定向到了主页
    if (data.includes("81215153")) {
      $done({
        content: "完全解锁",
        backgroundColor: "#E50914", // Netflix 红色
      });
    } else {
      $done({
        content: "仅限自制剧",
        backgroundColor: "#F5A623", // 橙色表示仅限自制剧
      });
    }
    return;
  }

  if (response.status === 403 || response.status === 404) {
    $done({
      content: "不支持的地区",
      backgroundColor: "#666666",
    });
    return;
  }

  $done({
    content: "Blocked",
    backgroundColor: "#000000",
  });
}

(async () => {
  main()
    .catch((error) => {
      $done({});
    });
})();