<?php

	class JGrid {

		/*public static function getCount($where = array(), $model = null) {
			$qBuilder = $model::select('*'); 
			$count = null;

			if(!empty($where)) {
				self::GenerateWhere($where, $qBuilder);				
			}
            
			$count = $qBuilder->count();

			return $count;
		}*/

        private static function generateOrder($grid_variables = array(), $qBuilder = array()) {

            if(is_array($grid_variables['base_columns'][$grid_variables['order']['column']])) {

                $arr_column = $grid_variables['base_columns'][$grid_variables['order']['column']];

                if($arr_column['type'] == 'aggregate') {
                    $qBuilder
                        ->orderBy($arr_column['alias'], $grid_variables['order']['type']);    
                } else {
                    $column = DB::raw('(' . $arr_column['column'] . ')'); 
                    $qBuilder
                        ->orderBy($column, $grid_variables['order']['type']);        
                }
                
            } else {
                $qBuilder
                    ->orderBy($grid_variables['base_columns'][$grid_variables['order']['column']], $grid_variables['order']['type']);    
            }
            
        }

        public static function generateRoute($url = '', $controllerAndMethod = '', $method = '', $additional_params = '') {

            if($method == 'POST') {
                return Route::post($url, $controllerAndMethod);
            } else if($method == 'GET') {
                $url_with_params = '';

                if(!empty($additional_params)) {
                    $url_with_params = $url . '/' . $additional_params . '/{grid_variables}';
                } else {
                    $url_with_params = $url . '/{grid_variables}';                    
                }
                return Route::get($url_with_params, $controllerAndMethod);
            }
            
        }

		private static function appendLimitOffset($limit = 10, $offset = 0, $qBuilder) {
			
            if($limit > 0) {
                $qBuilder->limit($limit);
            }

            $qBuilder->offset($offset);
		}

        public static function generateWhere($where = array(), $qBuilder = null) {
            
            if(!empty($where))  {
                foreach($where AS $index => $row_where) {
                    $search_type = $row_where['search_type'];

                    if(isset($row_where['value'])) {
                        $where_value = $row_where['value'];
                    } else {
                        $where_value = null;
                    }

                    if(isset($row_where['from_value'])) {
                        $from_value = $row_where['from_value'];
                    } else {
                        $from_value = null;
                    }

                    if(isset($row_where['to_value'])) {
                        $to_value = $row_where['to_value'];
                    } else {
                        $to_value = null;
                    }

                    if(is_array($row_where['column']['value'])) {

                        $arr_column = $row_where['column'];
                        $alias = $arr_column['alias'];
                        $type = $arr_column['value']['type'];   

                        if($type == 'aggregate') {
                            $column = $arr_column['alias'];
                        } else {
                            $column = DB::raw('(' . $arr_column['value']['column'] . ')');
                        }

                        switch($search_type) {
                            case 'text':
                                if(!is_null($where_value)) {
                                    if(!empty($where_value)) {
                                        if($type == 'aggregate') {

                                            $qBuilder->having($column, 'LIKE', '%' . $where_value . '%');
                                        } else {
                                            $qBuilder->where($column, 'LIKE', '%' . $where_value . '%');    
                                        }
                                    }
                                }
                                break;
                            case 'range_date':
                                $from_value = $row_where['from_value'];
                                $to_value = $row_where['to_value'];

                                if(!is_null($from_value) && !is_null($to_value)) {
                                    if(!empty($from_value) && !empty($to_value)) {

                                        if($search_type == 'aggregate') {
                                            $qBuilder
                                                ->having($column, '>', $from_value)
                                                ->having($column, '<', $to_value);
                                        } else {
                                            $qBuilder
                                                ->where($column, '>', $from_value)
                                                ->where($column, '<', $to_value);
                                        }
                                    }
                                }
                                break;
                            case 'dropdown':
                             
                                if(!is_null($where_value)) {
                                    if($where_value === false) {
                                        $where_value = 'false';
                                    }

                                    if(!empty($where_value)) {
                                        if($where_value === 'false') {
                                            $where_value = false;
                                        }

                                        if($search_type == 'aggregate') {
                                            $qBuilder->having($column, '=', $where_value);
                                        } else {
                                            $qBuilder->where($column, '=', $where_value);
                                        }
                                    }
                                }
                                break;
                        }
                    } else {

                        $column = $row_where['column']['value'];

                        switch($search_type) {
                            case 'text':
                                if(!is_null($where_value)) {
                                    if(!empty($where_value)) {
                                        $qBuilder->where($column, 'LIKE', '%' . $where_value . '%');
                                    }
                                }
                                break;
                            case 'range_date':
                                if(!is_null($from_value) && !is_null($to_value)) {
                                    if(!empty($from_value) && !empty($to_value)) {
                                        $qBuilder->whereBetween($column, array($from_value, $to_value));
                                    }
                                }
                                break;
                            case 'dropdown':
                             
                                if(!is_null($where_value)) {
                                    if($where_value === false) {
                                        $where_value = 'false';
                                    }
                                    if(!empty($where_value)) {
                                        if($where_value === 'false') {
                                            $where_value = false;
                                        }
                                        $qBuilder->where($column, '=', $where_value);
                                    }
                                }
                                break;
                        }   
                    }
                    
                }
            }
        }

        public static function generateCountWhere($where = array(), $qBuilder = null) {
    
            if(!empty($where))  {
                foreach($where AS $index => $row_where) {

                    $column = $row_where['column'];

                    switch($row_where['search_type']) {
                        case 'text':
                            if(isset($row_where['value'])) {
                                if(!empty($row_where['value'])) {
                                    $qBuilder->where('src.' . $row_where['column'], 'LIKE', '%' . $row_where['value'] . '%');
                                }
                            }
                            break;
                        case 'range_date':
                            if((isset($row_where['from_value']) && isset($row_where['to_value']))) {
                                if(!empty($row_where['from_value']) && !empty($row_where['to_value'])) {
                                    $qBuilder->whereBetween('src.' . $row_where['column'], array('src.' . $row_where['from_value'], $row_where['to_value']));
                                }
                            }
                            break;
                        case 'dropdown':
                         
                            if(isset($row_where['value'])) {
                                if($row_where['value'] === false) {
                                    $row_where['value'] = 'false';
                                }
                                if(!empty($row_where['value'])) {
                                    if($row_where['value'] === 'false') {
                                        $row_where['value'] = false;
                                    }
                                    $qBuilder->where('src.' . $row_where['column'], '=', 'src.' . $row_where['value']);
                                }
                            }
                            break;
                    }
                }
            }
        }

        public static function process($grid_variables = array(), $qBuilder = array()) {

            $countModel = $qBuilder->getModel();            
            $countBuilder = $countModel->from(DB::raw('(' . $qBuilder->toSql() . ') AS src'));
            
            self::generateWhere($grid_variables['database_where'], $qBuilder);

            $has_group_by = false;
            foreach($grid_variables['base_columns'] AS $alias_column => $column_value) {
                
                if(is_array($column_value)) {
                    if($column_value['type'] == 'aggregate') {
                        $has_group_by = true;
                    }
                }
            }

            if($has_group_by === false) {
                $count = $qBuilder->count();
            } else {
                self::generateCountWhere($grid_variables['where'], $countBuilder);                
                $count = $countBuilder->count();
            }
            
            $qBuilder->select($grid_variables['columns']);
            self::generateOrder($grid_variables, $qBuilder);
            self::appendLimitOffset($grid_variables['limit'], $grid_variables['offset'], $qBuilder);
            $data = $qBuilder->get()->toArray();

            if(($count / $grid_variables['limit']) > round($count / $grid_variables['limit'])) {
                $total_pages = round($count / $grid_variables['limit']) + 1;
            } else {
                $total_pages = round($count / $grid_variables['limit']);
            }
            
            
            return array(
                'data' => $data,
                'count' => $count,
                'total_pages' => $total_pages
            );
        }

        public static function initialize(&$grid_variables, $base_columns) {            
           self::initializeVariables($grid_variables, $base_columns);
           self::combineColumnAndAlias($grid_variables);
           self::generateWhereArray($grid_variables);
        }

        private static function initializeVariables(&$grid_variables, $base_columns) {

            if (Request::isMethod('post')) {
                $grid_variables = array(
                    'limit' => Input::get('limit', 50),
                    'offset' => Input::get('offset', 0),
                    'where' => Input::get('where', array()),
                    'order' => Input::get('order', array()),
                    'post_data' => Input::get('post_data', array())
                );
            } else {
                $grid_variables = json_decode($grid_variables, true);                
            }  
            $grid_variables['base_columns'] = $base_columns;            
        }

        private static function combineColumnAndAlias(&$grid_variables) {
            $grid_variables['columns'] = array();

            foreach($grid_variables['base_columns'] AS $alias_column => $column_value) {
                if(is_array($column_value)) {
                    /*if($column_value['type'] == 'subquery') {
                        $grid_variables['columns'][] = DB::raw('(' . $column_value['column'] . ') AS ' . $alias_column);
                    } else {
                        $grid_variables['columns'][] = DB::raw($column_value['aggregate'] . '(' . $column_value['column'] . ') AS ' . $alias_column);
                    }*/

                    if($column_value['type'] == 'aggregate') {
                        $column_value =  $column_value['column'];
                    } else {
                        $column_value =  '(' . $column_value['column'] . ')';
                    }

                    $grid_variables['columns'][] = DB::raw($column_value . ' AS ' . $alias_column);
                } else {
                    $grid_variables['columns'][] = $column_value . ' AS ' . $alias_column;    
                }                
            }        
        }

        private static function generateWhereArray(&$grid_variables) {
            
            $grid_variables['database_where'] = array();

            if(!empty($grid_variables['where'])) {

                foreach($grid_variables['where'] AS $ind => $where_row) {
                    $tmp_where = $where_row;

                    $tmp_where['column'] = array();
                    $tmp_where['column']['value'] = $grid_variables['base_columns'][$where_row['column']];
                    $tmp_where['column']['alias'] = $where_row['column'];
                    
                    $grid_variables['database_where'][] = $tmp_where;
                }
            }             
        }
	}