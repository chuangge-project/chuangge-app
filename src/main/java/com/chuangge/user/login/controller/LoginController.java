package com.chuangge.user.login.controller;

import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.chuangge.redis.util.RedisUtils;
import com.chuangge.user.common.util.Jsonp;
import com.chuangge.user.service.SmsSendService;

@Controller
public class LoginController {
	
	private static Logger logger = LoggerFactory.getLogger(LoginController.class);
	
	@Autowired
	private SmsSendService smsSendService;
	
	
	/*****
	 * 账户、密码登录
	 * @param username 用户名
	 * @param password 密码
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "outside/user/login")
	@ResponseBody
	public Jsonp login(String reqStr) throws Exception {
//		LoginRequestVo vo = (LoginRequestVo) JSONUtils.parse (reqStr);
		Jsonp jsonP = new Jsonp();
//		Map returnMap = new HashMap();
//		returnMap.put("returnCode", 1);
//		returnMap.put("returnMessage", "success");

		return jsonP;
	}
	
	/****
	 * 获取验证码
	 * @param reqStr
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "outside/user/getVerifyCode")
	@ResponseBody
	public JSONObject getVerifyCode(String mobile) throws Exception {
		int code = (int)(Math.random()*(9999-1000+1))+1000;
		RedisUtils.opsForValue().set("getVerifyCode"+mobile,code+"",5,TimeUnit.MINUTES);
		System.out.println(RedisUtils.opsForValue().get("getVerifyCode"+mobile));
		
		JSONObject param = new JSONObject();
		param.put("code", code+"");
		logger.info("发送短信mobile="+mobile+";code="+code);
		JSONObject json =  smsSendService.sendSms(mobile, param.toJSONString());
		logger.info("发送短信returnJson"+json.toString());
		return json;
	}
	
	
}
