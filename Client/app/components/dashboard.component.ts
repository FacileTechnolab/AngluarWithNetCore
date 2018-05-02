import { Component, OnInit } from '@angular/core';
import { Pager, PagerEvent } from '../model/pager';
import { Router, ActivatedRoute } from '@angular/router';
import { NgClass } from '@angular/common';
import { GridOptions } from 'ag-grid';
import { EmployeeService } from '../services/employee.service';
import { Employee, EmployeeList } from '../model/employee';
import { ErrorService } from '../shared/error.service';
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
    private pageSize = 10;
    public searchTerm = '';
    public gridOptions: GridOptions;
    public pageInfo: Pager;
	public employeeList: EmployeeList;
	public sortorder: '';
	public currntSortOrder = '';
	private filterOption = ['equals', 'notEqual', 'contains', 'startsWith', 'endsWith'];
    constructor(private _service: EmployeeService, private _errorService: ErrorService) {
        this.gridOptions = <GridOptions>{
            defaultColDef: {
                enableCellChangeFlash: false
            },
            enableFilter: true,
            enableSorting: true,
            floatingFilter: true,
            rowHeight: 30,
            headerHeight: 50,
            enableColResize: true,
            domLayout: 'autoHeight',
            context: {
                componentParent: this,
            },
			onGridSizeChanged: () => this.hideColumnsThatDontFit(),
			onFilterChanged: () => this.onFilterChange(),
			onSortChanged: () => this.onSortChange(),
			filterParams: {
				filterOptions: ['contains', 'notContains'],
			},
        };
    }

    ngOnInit() {
        this.pageInfo = new Pager();
        this.gridOptions.columnDefs = [
            {
                headerName: 'First Name',
                field: 'firstName',
				minWidth: 120,
				filterParams: {
					filterOptions: this.filterOption,
				},
            },
            {
                headerName: 'Last Name',
                field: 'lastName',
				minWidth: 120,
				filterParams: {
					filterOptions: this.filterOption
				},
            },
            {
                headerName: 'Email',
                field: 'email',
				minWidth: 120,
				filterParams: {
					filterOptions: this.filterOption
				},
            },
            {
                headerName: 'Title',
                field: 'jobTitle',
				minWidth: 120,
				filterParams: {
					filterOptions: this.filterOption
				},
            },
            {
                headerName: 'Department',
                field: 'department',
				minWidth: 120,
				filterParams: {
					filterOptions: this.filterOption
				},
            }
        ];
        this.getEmployees('', 0 ,'firstname','asc','','');
	}

	getEmployees(term: string, skip: number, SortBy: string, sortOrder: string,filter:string,filterkey:string)
    {
		let resultInfo: EmployeeList;
		this._service.get(term, skip, SortBy, sortOrder, filter, filterkey).then((data) => {           
            resultInfo = data as EmployeeList;
            if (resultInfo.result === undefined) {
                this.pageInfo = { resultCount: 0, endPage: 0, startPage: 0, totalRecord: 0, totalPage: 0, currentPage: 0 };
                this.gridOptions.api.showNoRowsOverlay();
            } else {
                this.pageInfo = { resultCount: resultInfo.resultCount, endPage: resultInfo.endPage, startPage: resultInfo.startPage, totalRecord: resultInfo.totalRecord, totalPage: resultInfo.totalPage, currentPage: resultInfo.currentPage };
				this.gridOptions.api.setRowData(resultInfo.result as Employee[]);
				this.gridOptions.api.setFilterModel(this.filterModel);
                if (resultInfo.result.length === 0) {
                    this.gridOptions.api.showNoRowsOverlay();
                } else {
                    this.gridOptions.api.hideOverlay();
                }
            }
        });

	}

    onPageChange(pageEvent: PagerEvent) {
        let skip = 0;
        switch (pageEvent.Type) {
            case 'First':
                skip = 0;
                break;
            case 'Last':
                skip = (pageEvent.Page.totalPage - 1) * this.pageSize;
                break;
            case 'Next':
                if (pageEvent.Page.totalPage === pageEvent.Page.currentPage) {
                    skip = (pageEvent.Page.totalPage - 1) * this.pageSize;
                } else {
                    skip = pageEvent.Page.currentPage * this.pageSize;
                }
                break;
            case 'Previous':
                if (pageEvent.Page.currentPage > 1) {
                    skip = (pageEvent.Page.currentPage - 2) * this.pageSize;
                } else {
                    skip = 0;
                }
                break;
            default:
                skip = 0;
                break;
        }
        
        this.gridOptions.api.showLoadingOverlay();		
		const filterSortData = this.getFilterSortInfo();		
		this.getEmployees(this.searchTerm, skip, filterSortData.sortStr, filterSortData.sortOrder, filterSortData.fitertype, filterSortData.filterkey);		 
    }

	hideColumnsThatDontFit() {
        let gridWidth = $('#empGrid').outerWidth();
        let columnsToShow = [];
        let columnsToHide = [];
        let totalColsWidth = 0;
        let allColumns = this.gridOptions.columnApi.getAllColumns();
        for (let i = 0; i < allColumns.length; i++) {
            const column = allColumns[i];
            totalColsWidth += column.getMinWidth();
            if (totalColsWidth > gridWidth) {
                columnsToHide.push(column);
            } else {
                columnsToShow.push(column);
            }
        }
        this.gridOptions.columnApi.setColumnsVisible(columnsToShow, true);
        this.gridOptions.columnApi.setColumnsVisible(columnsToHide, false);
        this.gridOptions.api.sizeColumnsToFit();
        
	}
	
	private filterModel: any;

	private prevFilterStr = '';

	
	onFilterChange() {
		const filterSortData = this.getFilterSortInfo();	 
		if (this.prevFilterStr !== filterSortData.filterStr) {
			this.prevFilterStr = filterSortData.filterStr;
			this.gridOptions.api.showLoadingOverlay();
			let filter = filterSortData.filterStr.split("=")
			if (filter[1] == undefined)
			{
				filter[1] = '';
			}
			this.searchTerm = filter[1];

			this.getEmployees(filter[1], 0, filterSortData.sortStr, filterSortData.sortOrder, filterSortData.fitertype, filterSortData.filterkey);				
		}
	}

	getFilterSortInfo() {
		this.filterModel = this.gridOptions.api.getFilterModel();		
		const sortModel = this.gridOptions.api.getSortModel();
		let filterStr = '';
		let sortStr = '';
		let sortOrder = '';
		let fitertype = ''
		let filterkey = '';
		
		const headerKeys = ['firstName', 'lastName', 'email', 'jobTitle', 'department'];
		headerKeys.forEach((key) => {
			const colFilter = this.filterModel[key];
			
			if (colFilter !== undefined) {
				if (filterStr !== '') {
					filterStr += '&';
					fitertype = colFilter.type;					
				}
				filterStr += key;
				fitertype = colFilter.type
				filterkey = key;
				switch (colFilter.type) {
					case 'notEqual':
						filterStr += '!=' + colFilter.filter;
						break;
					case 'equals':
						filterStr += '=' + colFilter.filter;
						break;
					case 'startsWith':
						filterStr += 'StartsWith=' + colFilter.filter;
						break;
					case 'endsWith':
						filterStr += 'EndsWith=' + colFilter.filter;
						break;
					case 'contains':
						filterStr += 'Contains=' + colFilter.filter;
						break;
					case 'notContains':
						filterStr += 'NotContains!=' + colFilter.filter;
						break;
					default:
						filterStr += colFilter.type + '=' + colFilter.filter;
						break;
				}
			}
		});
		if (sortModel.length !== undefined && sortModel.length !== 0) {
			sortStr = 'orderby=';
			sortModel.forEach(element => {
				if (element.sort === 'desc') {
					sortStr = element.colId;
					sortOrder = "desc";
				} else {
					sortStr = element.colId;
					sortOrder = "asc";
				}
			});
		}
		return { filterStr, sortStr, sortOrder, fitertype, filterkey  };
	}

	onRevFilter(e: any) {

		this.searchTerm = e.target.value;
		if (this.searchTerm.length >= 1) {
			this.getEmployees(this.searchTerm, 0,'','','','');
		}
		if (this.searchTerm.length === 0) {
			this.searchTerm = '';
			this.getEmployees(this.searchTerm, 0,'','','','');
		}
	}

	onSortChange() {
		this.gridOptions.api.showLoadingOverlay();
		const filterSortData = this.getFilterSortInfo();
		this.getEmployees(this.searchTerm,0, filterSortData.sortStr, filterSortData.sortOrder, filterSortData.fitertype, filterSortData.filterkey);		 						 
	}

}
