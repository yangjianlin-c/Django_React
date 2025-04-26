
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate

python manage.py showmigrations
python manage.py migrate courses 0007_course_feature

python manage.py runserver

pip install django-theme-pixel

## 创建管理员
python manage.py createsuperuser

## 创建app
python manage.py startapp courses

### 修改settings.py
INSTALLED_APPS = [
    'home',
]

### 管理页面中添加app
from django.contrib import admin
from .models import Question

admin.site.register(Question)


## 导入数据
python manage.py loaddata data.json

## 导出数据
python manage.py dumpdata > backup.json

81.68.94.171
3308
mekesim
MML2RRM4jYEphFjC

docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' mekesim

docker exec -it mekesim mysql -u root -p

https://mp.weixin.qq.com/s/zcfOddA6znXxwbQxTkQ22g


wget http://download.bt.cn/install/1/mysql.sh
bash mysql.sh install 8.0

python3 manage.py makemigrations
python3 manage.py migrate

python3 manage.py dumpdata courses.Course --output courses.json
python3 manage.py dumpdata courses.Lesson --output lessons.json

python manage.py loaddata modified_courses.json --clear
python3 manage.py loaddata lessons.json --clear
