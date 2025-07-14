import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  ShoppingCart, 
  FileText, 
  CheckSquare, 
  TrendingUp,
  AlertTriangle,
  Plus
} from "lucide-react"
import { Link } from "react-router-dom"

export default function Dashboard() {
  const stats = [
    {
      title: "Total Suppliers",
      value: "124",
      change: "+12%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Purchases",
      value: "47",
      change: "+5%",
      icon: ShoppingCart,
      color: "text-green-600"
    },
    {
      title: "Pending Verifications",
      value: "8",
      change: "-3%",
      icon: CheckSquare,
      color: "text-orange-600"
    },
    {
      title: "Risk Alerts",
      value: "3",
      change: "0%",
      icon: AlertTriangle,
      color: "text-red-600"
    }
  ]

  const quickActions = [
    { title: "Add Supplier", icon: Users, href: "/suppliers", color: "bg-blue-50 text-blue-700 hover:bg-blue-100" },
    { title: "New Purchase", icon: ShoppingCart, href: "/purchasing", color: "bg-green-50 text-green-700 hover:bg-green-100" },
    { title: "Create Verification", icon: CheckSquare, href: "/verification", color: "bg-purple-50 text-purple-700 hover:bg-purple-100" },
    { title: "View Audit Trail", icon: FileText, href: "/audit", color: "bg-orange-50 text-orange-700 hover:bg-orange-100" }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your Quality Management System</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/suppliers">
              <Plus className="h-4 w-4 mr-2" />
              Quick Add
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stat.change} from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks to get you started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Button
                key={action.title}
                variant="ghost"
                asChild
                className={`h-auto p-4 flex flex-col items-center gap-2 ${action.color}`}
              >
                <Link to={action.href}>
                  <action.icon className="h-6 w-6" />
                  <span className="text-sm font-medium">{action.title}</span>
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Purchases</CardTitle>
            <CardDescription>Latest purchasing activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Purchase Order #{1000 + i}</p>
                    <p className="text-sm text-muted-foreground">Supplier ABC Corp</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$2,{500 + i * 100}</p>
                    <p className="text-xs text-green-600">Approved</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>Items requiring your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Verification Plan #{100 + i}</p>
                    <p className="text-sm text-muted-foreground">Due in {i + 1} days</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Review
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}