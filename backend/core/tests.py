from django.core import mail
from django.test import TestCase


class EmailTest(TestCase):
    def test_send_email(self):
        mail.send_mail(
            "测试邮件",
            "Here is the message.",
            "service@mekesim.com",
            ["94519510@qq.com"],
        )
        print(f"邮件发送结果: {len(mail.outbox)}")
