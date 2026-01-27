async function request(method, params) {
  return new Promise((resolve, reject) => {
    const httpMethod = $httpClient[method.toLowerCase()];
    httpMethod(params, (error, response, data) => {
      resolve({ error, response, data });
    });
  });
}

async function main() {
  const { error, response, data } = await request(
    "GET",
    "https://www.youtube.com/premium"
  );

  if (error) {
    $done({
      content: "Network Error",
      backgroundColor: "",
    });
    return;
  }

  // 检查返回内容中是否包含“在您所在的国家/地区不可用”的英文特征字符
  if (data.toLowerCase().includes("premium is not available") || data.toLowerCase().includes("is not currently available")) {
    $done({
      content: "不支持的地区",
      backgroundColor: "#666666",
    });
    return;
  }

  $done({
    content: "Available",
    backgroundColor: "#FF0000", // YouTube 红色
  });
}

(async () => {
  main()
    .then((_) => {})
    .catch((error) => {
      $done({});
    });
})();