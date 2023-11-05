from django.http import HttpResponse
from django.shortcuts import render
import requests
from bs4 import BeautifulSoup

def hello_world(request):
    return HttpResponse("Hello, world!")

def menu_view(request):
    # 진선미관 식당 정보 스크래핑
    response1 = requests.get('http://www.ewha.ac.kr/ewha/life/restaurant.do?mode=view&articleNo=903&article.offset=0&articleLimit=10')
    soup1 = BeautifulSoup(response1.text, 'html.parser')
    lunch_menu_tags1 = soup1.select('.b-menu.b-menu-l.lunch')
    menus1 = []
    days = ['월요일', '화요일', '수요일', '목요일', '금요일']

    # 두 리스트 중 더 짧은 길이를 기준으로 loop를 돌립니다
    loop_count = min(len(lunch_menu_tags1), len(days))

    for i in range(loop_count):
        menu_text1 = lunch_menu_tags1[i].get_text().strip()
        menus1.append({'day': days[i], 'menu': menu_text1})

    # 신공학관 식당 정보 스크래핑
    response2 = requests.get('http://www.ewha.ac.kr/ewha/life/restaurant.do?mode=view&articleNo=905&article.offset=0&articleLimit=10')
    soup2 = BeautifulSoup(response2.text, 'html.parser')
    lunch_menu_tags2 = soup2.select('.b-menu.b-menu-l.lunch')
    menus2 = []

    for i in range(min(len(lunch_menu_tags2), len(days))):
        menu_text2 = lunch_menu_tags2[i].get_text().strip()
        # 두 개의 공백을 기준으로 메뉴를 나눔
        menu_items2 = menu_text2.split('  ')
        
        # 첫 번째 아이템을 별도로 저장하고 나머지만 refine
        first_item = menu_items2[0]
        other_items = menu_items2[1:]

        # 각 아이템에 하나의 공백이 있으면 그것도 구분
        refined_menu_items2 = []
        for item in other_items:
            if ' ' in item:
                sub_items = item.split(' ')
                refined_menu_items2.extend(sub_items)
            else:
                refined_menu_items2.append(item)
    
        # 첫 번째 메뉴 아이템에서 "- 중식 -" 뒤에 <br><br> 추가
        keyword_index = first_item.find('- 중식 -')
        if keyword_index != -1:
            first_item = first_item[:keyword_index + len('- 중식 -')] + '<br><br>' + first_item[keyword_index + len('- 중식 -'):]

        # <br>을 넣어서 다시 조합
        menu_text2 = '<br>'.join([first_item] + refined_menu_items2)
        menus2.append({'day': days[i], 'menu': menu_text2})

    # 두 메뉴 정보를 같이 넘김
    return render(request, 'menu.html', {'menus1': menus1, 'menus2': menus2})
