import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output
} from '@angular/core';

import {
  forkJoin,
  of
} from 'rxjs';

import {
  catchError,
  take
} from 'rxjs/operators';

import {
  ProductService,
  Product
} from '../../../core/services/product.service';

import {
  OrderService,
  Order
} from '../../../core/services/order.service';

import {
  UserService
} from '../../../core/services/user.service';

import {
  CategoryService,
  Category
} from '../../../core/services/category.service';

import {
  User
} from '../../../core/services/auth.service';


export interface DailyRevenueData {

  dayLabel: string;

  dateStr: string;

  revenue: number;

  ordersCount: number;

  x: number;

  y: number;
}


export interface CategoryMetric {

  name: string;

  count: number;

  revenue: number;

  percentage: number;
}


export interface OrderStatusDistribution {

  status: string;

  label: string;

  count: number;

  percentage: number;

  color: string;
}


@Component({

  selector: 'app-admin-overview',

  standalone: false,

  templateUrl:
    './admin-overview.component.html',

  styleUrl:
    './admin-overview.component.css'
})
export class AdminOverviewComponent
  implements OnInit {


  @Output()
  navigateTab =
    new EventEmitter<string>();


  // =====================================================
  // DATA
  // =====================================================

  products: Product[] = [];

  orders: Order[] = [];

  users: User[] = [];

  categories: Category[] = [];


  // =====================================================
  // STATE
  // =====================================================

  isLoading = true;

  categoriesCount = 0;


  // =====================================================
  // KPI
  // =====================================================

  totalRevenue = 0;

  pendingOrdersCount = 0;


  // =====================================================
  // INVENTORY
  // =====================================================

  lowStockProducts:
    Product[] = [];


  // =====================================================
  // RECENT ORDERS
  // =====================================================

  recentOrders:
    Order[] = [];


  // =====================================================
  // REVENUE CHART
  // =====================================================

  dailyRevenueList:
    DailyRevenueData[] = [];

  svgLinePath = '';

  svgAreaPath = '';

  maxDailyRevenue = 0;

  hoveredDataPoint:
    DailyRevenueData | null = null;


  // =====================================================
  // ORDER STATUS
  // =====================================================

  orderStatusDist:
    OrderStatusDistribution[] = [];


  // =====================================================
  // CATEGORIES
  // =====================================================

  topCategories:
    CategoryMetric[] = [];


  // =====================================================
  // RESTOCK
  // =====================================================

  isRestockingMap:
    Record<string, boolean> = {};


  constructor(

    private productService:
      ProductService,

    private orderService:
      OrderService,

    private userService:
      UserService,

    private categoryService:
      CategoryService,

    private cdr:
      ChangeDetectorRef

  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadData();

  }


  // =====================================================
  // LOAD DATA
  // =====================================================

  loadData(): void {

    this.isLoading = true;


    console.log(
      'ADMIN OVERVIEW: loading data...'
    );


    forkJoin({

      products:

        this.productService
          .getAll()
          .pipe(

            take(1),

            catchError(
              (error) => {

                console.error(
                  'Products API error:',
                  error
                );

                return of({

                  success: false,

                  data:
                    [] as Product[]

                });

              }
            )

          ),


      orders:

        this.orderService
          .getAllOrders()
          .pipe(

            take(1),

            catchError(
              (error) => {

                console.error(
                  'Orders API error:',
                  error
                );

                return of({

                  success: false,

                  data:
                    [] as Order[]

                });

              }
            )

          ),


      users:

        this.userService
          .getAll()
          .pipe(

            take(1),

            catchError(
              (error) => {

                console.error(
                  'Users API error:',
                  error
                );

                return of({

                  success: false,

                  data:
                    [] as User[]

                });

              }
            )

          ),


      categories:

        this.categoryService
          .getAll()
          .pipe(

            take(1),

            catchError(
              (error) => {

                console.error(
                  'Categories API error:',
                  error
                );

                return of({

                  success: false,

                  data:
                    [] as Category[]

                });

              }
            )

          )

    })

    .subscribe({

      next: (
        results
      ) => {


        // =================================================
        // PRODUCTS
        // =================================================

        this.products =
          results.products.success &&
          Array.isArray(
            results.products.data
          )

            ? results.products.data

            : [];


        // =================================================
        // ORDERS
        // =================================================

        this.orders =
          results.orders.success &&
          Array.isArray(
            results.orders.data
          )

            ? results.orders.data

            : [];


        // =================================================
        // USERS
        // =================================================

        this.users =
          results.users.success &&
          Array.isArray(
            results.users.data
          )

            ? results.users.data

            : [];


        // =================================================
        // CATEGORIES
        // =================================================

        this.categories =
          results.categories.success &&
          Array.isArray(
            results.categories.data
          )

            ? results.categories.data

            : [];


        // =================================================
        // CATEGORY COUNT
        // =================================================

        this.categoriesCount =
          this.categories.length;


        // =================================================
        // LOW STOCK
        // =================================================

        this.lowStockProducts =
          this.products.filter(
            (product) =>
              Number(
                product.stock ?? 0
              ) < 5
          );


        // =================================================
        // PENDING ORDERS
        // =================================================

        this.pendingOrdersCount =
          this.orders.filter(
            (order) =>
              order.status === 'pending' ||
              order.status === 'processing'
          ).length;


        // =================================================
        // REAL REVENUE
        // =================================================

        this.totalRevenue =
          this.orders

            .filter(
              (order) =>
                order.status !== 'cancelled'
            )

            .reduce(
              (
                total,
                order
              ) =>

                total +
                Number(
                  order.totalPrice || 0
                ),

              0
            );


        // =================================================
        // RECENT ORDERS
        // =================================================

        this.recentOrders =

          [...this.orders]

            .sort(
              (
                a,
                b
              ) =>

                new Date(
                  b.createdAt
                ).getTime()

                -

                new Date(
                  a.createdAt
                ).getTime()
            )

            .slice(
              0,
              5
            );


        // =================================================
        // ANALYTICS
        // =================================================

        this.computeRevenueTrends();

        this.computeOrderStatusDistribution();

        this.computeCategoryMetrics();


        // =================================================
        // STOP LOADING
        // =================================================

        this.isLoading = false;


        // =================================================
        // IMPORTANT
        //
        // Force Angular to update the actual DOM.
        // =================================================

        this.cdr.detectChanges();


        console.log(
          'ADMIN OVERVIEW FINAL DATA:',
          {

            products:
              this.products.length,

            orders:
              this.orders.length,

            users:
              this.users.length,

            categories:
              this.categories.length,

            revenue:
              this.totalRevenue,

            pending:
              this.pendingOrdersCount,

            recentOrders:
              this.recentOrders.length

          }
        );

      },


      error: (
        error
      ) => {

        console.error(
          'ADMIN OVERVIEW LOAD FAILED:',
          error
        );


        this.isLoading = false;


        this.cdr.detectChanges();

      }

    });

  }


  // =====================================================
  // REVENUE CHART
  // =====================================================

  private computeRevenueTrends(): void {

    const days:
      DailyRevenueData[] = [];


    const now =
      new Date();


    for (
      let i = 6;
      i >= 0;
      i--
    ) {

      const date =
        new Date(now);


      date.setHours(
        0,
        0,
        0,
        0
      );


      date.setDate(
        now.getDate() - i
      );


      const dateStr =
        this.getLocalDateKey(
          date
        );


      const dayLabel =
        date.toLocaleDateString(
          'en-US',
          {
            weekday:
              'short'
          }
        );


      const dayOrders =
        this.orders.filter(
          (
            order
          ) => {

            if (
              !order.createdAt
            ) {

              return false;

            }


            if (
              order.status ===
              'cancelled'
            ) {

              return false;

            }


            return (

              this.getLocalDateKey(
                new Date(
                  order.createdAt
                )
              )

              ===

              dateStr

            );

          }
        );


      const revenue =
        dayOrders.reduce(
          (
            sum,
            order
          ) =>

            sum +
            Number(
              order.totalPrice || 0
            ),

          0
        );


      days.push({

        dayLabel,

        dateStr,

        revenue,

        ordersCount:
          dayOrders.length,

        x: 0,

        y: 0

      });

    }


    this.maxDailyRevenue =

      Math.max(
        ...days.map(
          d => d.revenue
        ),
        0
      );


    if (
      this.maxDailyRevenue === 0
    ) {

      this.maxDailyRevenue = 100;

    } else {

      this.maxDailyRevenue =
        Math.ceil(
          this.maxDailyRevenue *
          1.15
        );

    }


    const svgWidth =
      600;

    const svgHeight =
      200;

    const paddingX =
      45;

    const paddingTop =
      20;

    const paddingBottom =
      45;


    const usableWidth =
      svgWidth -
      paddingX * 2;


    const usableHeight =
      svgHeight -
      paddingTop -
      paddingBottom;


    const baselineY =
      svgHeight -
      paddingBottom;


    days.forEach(
      (
        point,
        index
      ) => {

        point.x =

          paddingX +

          (
            index /
            6
          ) *

          usableWidth;


        const ratio =

          this.maxDailyRevenue > 0

            ? point.revenue /
              this.maxDailyRevenue

            : 0;


        point.y =

          baselineY -

          ratio *
          usableHeight;

      }
    );


    this.dailyRevenueList =
      days;


    if (
      days.length === 0
    ) {

      this.svgLinePath = '';

      this.svgAreaPath = '';

      return;

    }


    let linePath =
      `M ${days[0].x} ${days[0].y}`;


    for (
      let i = 1;
      i < days.length;
      i++
    ) {

      const previous =
        days[i - 1];

      const current =
        days[i];


      const controlX =

        previous.x +

        (
          current.x -
          previous.x
        ) / 2;


      linePath +=

        ` C ${controlX} ${previous.y}, ` +

        `${controlX} ${current.y}, ` +

        `${current.x} ${current.y}`;

    }


    this.svgLinePath =
      linePath;


    const firstX =
      days[0].x;


    const lastX =
      days[
        days.length - 1
      ].x;


    this.svgAreaPath =

      `${linePath} ` +

      `L ${lastX} ${baselineY} ` +

      `L ${firstX} ${baselineY} Z`;

  }


  // =====================================================
  // ORDER STATUS
  // =====================================================

  private computeOrderStatusDistribution(): void {

    const statuses = [

      {
        status:
          'delivered',

        label:
          'Delivered',

        color:
          '#10b981'
      },

      {
        status:
          'processing',

        label:
          'Processing',

        color:
          '#3b82f6'
      },

      {
        status:
          'pending',

        label:
          'Pending',

        color:
          '#f59e0b'
      },

      {
        status:
          'shipped',

        label:
          'Shipped',

        color:
          '#8b5cf6'
      },

      {
        status:
          'cancelled',

        label:
          'Cancelled',

        color:
          '#f43f5e'
      }

    ];


    const total =
      this.orders.length;


    if (
      total === 0
    ) {

      this.orderStatusDist =
        [];

      return;

    }


    this.orderStatusDist =

      statuses

        .map(
          (
            status
          ) => {

            const count =
              this.orders.filter(
                order =>
                  order.status ===
                  status.status
              ).length;


            return {

              ...status,

              count,

              percentage:
                Math.round(
                  (
                    count /
                    total
                  ) *
                  100
                )

            };

          }
        )

        .filter(
          item =>
            item.count > 0
        );

  }


  // =====================================================
  // CATEGORY METRICS
  // =====================================================

  private computeCategoryMetrics(): void {

    if (
      this.categories.length === 0 ||
      this.products.length === 0
    ) {

      this.topCategories =
        [];

      return;

    }


    const categoryMap =
      new Map<
        string,
        {
          name: string;
          count: number;
        }
      >();


    this.categories.forEach(
      (
        category
      ) => {

        const id =
          category._id ||
          category.uuid;


        if (!id) {

          return;

        }


        categoryMap.set(
          id,
          {

            name:
              category.name,

            count:
              0

          }
        );

      }
    );


    this.products.forEach(
      (
        product
      ) => {

        const category =
          product.category;


        const categoryId =

          typeof category ===
          'object'

            ? (
                category?._id ||
                category?.uuid
              )

            : category;


        if (!categoryId) {

          return;

        }


        const metric =
          categoryMap.get(
            categoryId
          );


        if (metric) {

          metric.count++;

        }

      }
    );


    const totalProducts =
      this.products.length;


    this.topCategories =

      Array.from(
        categoryMap.values()
      )

        .filter(
          item =>
            item.count > 0
        )

        .map(
          item => ({

            name:
              item.name,

            count:
              item.count,

            revenue:
              0,

            percentage:
              Math.round(
                (
                  item.count /
                  totalProducts
                ) *
                100
              )

          })
        )

        .sort(
          (
            a,
            b
          ) =>
            b.count -
            a.count
        )

        .slice(
          0,
          5
        );

  }


  // =====================================================
  // QUICK RESTOCK
  // =====================================================

  quickRestock(
    product: Product,
    addAmount = 10
  ): void {

    if (
      !product.uuid ||
      this.isRestockingMap[
        product.uuid
      ]
    ) {

      return;

    }


    this.isRestockingMap[
      product.uuid
    ] = true;


    const updatedStock =

      Number(
        product.stock ?? 0
      ) +

      addAmount;


    this.productService

      .update(
        product.uuid,
        {
          stock:
            updatedStock
        }
      )

      .subscribe({

        next: (
          response
        ) => {

          if (
            response?.success
          ) {

            product.stock =
              updatedStock;

          }


          this.lowStockProducts =
            this.products.filter(
              item =>
                Number(
                  item.stock ?? 0
                ) < 5
            );


          this.isRestockingMap[
            product.uuid
          ] = false;


          this.cdr.detectChanges();

        },


        error: (
          error
        ) => {

          console.error(
            'Restock failed:',
            error
          );


          this.isRestockingMap[
            product.uuid
          ] = false;


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // NAVIGATION
  // =====================================================

  goToTab(
    tab: string
  ): void {

    this.navigateTab.emit(
      tab
    );

  }


  // =====================================================
  // STATUS COLOR
  // =====================================================

  getStatusColor(
    status: string
  ): string {

    const colors:
      Record<string, string> = {

        pending:
          'var(--color-warning)',

        processing:
          '#3b82f6',

        shipped:
          '#8b5cf6',

        delivered:
          'var(--color-success)',

        cancelled:
          'var(--color-error)'

      };


    return (
      colors[status] ||
      '#9ca3af'
    );

  }


  // =====================================================
  // DATE KEY
  // =====================================================

  private getLocalDateKey(
    date: Date
  ): string {

    const year =
      date.getFullYear();


    const month =
      String(
        date.getMonth() + 1
      ).padStart(
        2,
        '0'
      );


    const day =
      String(
        date.getDate()
      ).padStart(
        2,
        '0'
      );


    return (
      `${year}-${month}-${day}`
    );

  }

}