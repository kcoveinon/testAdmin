<div class="ui tiered @if(Session::get('userData.theme') == 'admin') purple @else teal @endif inverted menu" ng-controller="globalHeaderController">
    <div class="menu">
        <div class="header item">
            VroomVroomVroom Administration
        </div>
        <a class="item" change-user-type>
            <i class="users icon"></i> Partners
        </a>
        @if(Session::get('userData.theme') == 'admin')
        <a class="item">
            <i class="users icon"></i> Suppliers
        </a>
        @endif
        <div class="right menu">
            <div class="ui dropdown item" menu-hover><i class="info icon"></i> {{{ Auth::user()->name }}} <i class="dropdown icon"></i>
                <div class="menu">
                    <div class="item"><i class="user icon"></i>Edit Profile</div>
                    @if(Auth::user()->role == 1)
                    <div class="item" change-user-type><i class="sign in icon"></i>Log in as...</div>
                        @if(Session::get('userData.theme') != 'admin')
                    <div class="item" session-change="{{Session::get('userData.originalCompanyID')}}"><i class="sign in icon"></i>Go Back as Admin</div>
                        @endif
                    @endif
                    <a class="item" href="users/logout"><i class="sign out icon"></i>Logout</a>
                </div>
            </div>
        </div>
    </div>
    <div class="sub menu">
        @foreach ($userMenus as $menu)
            @if (count($menu['subMenu']) == 0)
                <a class="item" menu-action="{{$menu['menuAction']}}" menu-action-parameter="{{$menu['menuActionParameter']}}">{{$menu['menuName']}}</a>
            @else
                <div class="ui dropdown item" menu-hover><i class="{{$menu['menuIcon']}}"></i>{{$menu['menuName']}}<i class="dropdown icon"></i>
                    <div class="menu">
                        @foreach ($menu['subMenu'] as $subMenu)
                            <a class="item" menu-action="{{$subMenu['subMenuAction']}}" menu-action-parameter="{{$subMenu['subMenuActionParameter']}}">{{$subMenu['subMenuName']}}</a>
                        @endforeach
                    </div>
                </div>
            @endif
            
        @endforeach
    </div>

    <custom-modal
        watch = "showChangeUserTypeModal"
        content = "changeUserTypeModalContent"
        settings = "changeUserTypeModalSettings"
    ></custom-modal>
</div>