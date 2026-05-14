import {
  MainContent,
  PageTitle,
  Title,
  ActionButtons,
  Button,
  StatsCards,
  StatCard,
  CardHeader,
  CardValue,
  CardLabel,
  CardIcon,
  CardChange,
  TableCard,
  CardTitle,
  DataTable,
  Status,
} from "../../constants/styles";

export const Content = () => {
  return (
    <MainContent>
      <PageTitle>
        <Title>Dashboard</Title>
        <ActionButtons>
          <Button $variant="outline" className="btn">
            <i className="fas fa-download" />
            Export
          </Button>
          <Button className="btn">
            <i className="fas fa-plus" />
            Add New
          </Button>
        </ActionButtons>
      </PageTitle>

      <StatsCards>
        <StatCard $variant={1}>
          <CardHeader>
            <div>
              <CardValue className="card-value">1,504</CardValue>
              <CardLabel>Total Users</CardLabel>
            </div>
            <CardIcon className="card-icon" $color="purple">
              <i className="fas fa-users" />
            </CardIcon>
          </CardHeader>
          <CardChange $positive>
            <i className="fas fa-arrow-up" />
            <span>12.5% from last month</span>
          </CardChange>
        </StatCard>

        <StatCard $variant={2}>
          <CardHeader>
            <div>
              <CardValue className="card-value">$12,750</CardValue>
              <CardLabel>Total Revenue</CardLabel>
            </div>
            <CardIcon className="card-icon" $color="blue">
              <i className="fas fa-dollar-sign" />
            </CardIcon>
          </CardHeader>
          <CardChange $positive>
            <i className="fas fa-arrow-up" />
            <span>8.2% from last month</span>
          </CardChange>
        </StatCard>

        <StatCard $variant={3}>
          <CardHeader>
            <div>
              <CardValue className="card-value">324</CardValue>
              <CardLabel>Total Orders</CardLabel>
            </div>
            <CardIcon className="card-icon" $color="green">
              <i className="fas fa-shopping-cart" />
            </CardIcon>
          </CardHeader>
          <CardChange $positive={false}>
            <i className="fas fa-arrow-down" />
            <span>3.1% from last month</span>
          </CardChange>
        </StatCard>

        <StatCard $variant={4}>
          <CardHeader>
            <div>
              <CardValue className="card-value">85%</CardValue>
              <CardLabel>Conversion Rate</CardLabel>
            </div>
            <CardIcon className="card-icon" $color="orange">
              <i className="fas fa-chart-line" />
            </CardIcon>
          </CardHeader>
          <CardChange $positive>
            <i className="fas fa-arrow-up" />
            <span>4.6% from last month</span>
          </CardChange>
        </StatCard>
      </StatsCards>

      <TableCard>
        <CardTitle>
          <h3>
            <i className="fas fa-shopping-bag" /> Recent Orders
          </h3>
          <Button $variant="outline" $size="sm">
            <i className="fas fa-eye" /> View All
          </Button>
        </CardTitle>
        <DataTable>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#ORD-001</td>
              <td>John Smith</td>
              <td>15 Mar 2025</td>
              <td>$125.00</td>
              <td>
                <Status $variant="active">
                  <i className="fas fa-check-circle" /> Completed
                </Status>
              </td>
              <td>
                <Button $variant="outline" $size="sm">
                  <i className="fas fa-eye" /> View
                </Button>
              </td>
            </tr>
            <tr>
              <td>#ORD-002</td>
              <td>Emma Johnson</td>
              <td>14 Mar 2025</td>
              <td>$245.99</td>
              <td>
                <Status $variant="pending">
                  <i className="fas fa-clock" /> Pending
                </Status>
              </td>
              <td>
                <Button $variant="outline" $size="sm">
                  <i className="fas fa-eye" /> View
                </Button>
              </td>
            </tr>
            <tr>
              <td>#ORD-003</td>
              <td>Michael Brown</td>
              <td>13 Mar 2025</td>
              <td>$79.50</td>
              <td>
                <Status $variant="active">
                  <i className="fas fa-check-circle" /> Completed
                </Status>
              </td>
              <td>
                <Button $variant="outline" $size="sm">
                  <i className="fas fa-eye" /> View
                </Button>
              </td>
            </tr>
            <tr>
              <td>#ORD-004</td>
              <td>Sarah Davis</td>
              <td>12 Mar 2025</td>
              <td>$350.00</td>
              <td>
                <Status $variant="cancelled">
                  <i className="fas fa-times-circle" /> Cancelled
                </Status>
              </td>
              <td>
                <Button $variant="outline" $size="sm">
                  <i className="fas fa-eye" /> View
                </Button>
              </td>
            </tr>
            <tr>
              <td>#ORD-005</td>
              <td>David Wilson</td>
              <td>11 Mar 2025</td>
              <td>$185.25</td>
              <td>
                <Status $variant="active">
                  <i className="fas fa-check-circle" /> Completed
                </Status>
              </td>
              <td>
                <Button $variant="outline" $size="sm">
                  <i className="fas fa-eye" /> View
                </Button>
              </td>
            </tr>
          </tbody>
        </DataTable>
      </TableCard>
    </MainContent>
  );
};
