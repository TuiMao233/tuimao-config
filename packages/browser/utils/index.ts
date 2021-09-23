/*
 * @Author: Mr.Mao
 * @Date: 2021-08-03 15:14:45
 * @LastEditTime: 2021-08-03 15:14:50
 * @Description:
 * @LastEditors: Mr.Mao
 * @autograph: 任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
 */

/**
 * 跳转到新的页面
 * @param url 跳转url
 */
export const ejectWindow = (url: string) => {
  const a = document.createElement('a')
  a.href = url
  a.target = '_blank'
  a.click()
}

/**
 * 拨打手机号
 * @param phoneNumber 手机号码
 */
export const makePhoneCall = (phoneNumber: string) => {
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = `tel:${phoneNumber}`
  document.body.append(link)
  link.click()
}
