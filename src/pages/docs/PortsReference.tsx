import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Network, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface PortItem {
  port: string;
  protocol: string;
  service: string;
  description: string;
}

interface PortSection {
  title: string;
  ports: PortItem[];
}

const portData: PortSection[] = [
  {
    title: "Web 服务",
    ports: [
      { port: "80", protocol: "TCP", service: "HTTP", description: "超文本传输协议" },
      { port: "443", protocol: "TCP", service: "HTTPS", description: "安全HTTP协议" },
      { port: "8080", protocol: "TCP", service: "HTTP-Alt", description: "备用HTTP端口" },
      { port: "8443", protocol: "TCP", service: "HTTPS-Alt", description: "备用HTTPS端口" },
      { port: "3000", protocol: "TCP", service: "Dev Server", description: "开发服务器常用端口" },
      { port: "5000", protocol: "TCP", service: "Flask/Dev", description: "Flask/开发服务器" },
      { port: "5173", protocol: "TCP", service: "Vite", description: "Vite开发服务器" },
      { port: "4200", protocol: "TCP", service: "Angular", description: "Angular开发服务器" },
    ]
  },
  {
    title: "数据库",
    ports: [
      { port: "3306", protocol: "TCP", service: "MySQL", description: "MySQL数据库" },
      { port: "5432", protocol: "TCP", service: "PostgreSQL", description: "PostgreSQL数据库" },
      { port: "27017", protocol: "TCP", service: "MongoDB", description: "MongoDB数据库" },
      { port: "6379", protocol: "TCP", service: "Redis", description: "Redis缓存/数据库" },
      { port: "11211", protocol: "TCP/UDP", service: "Memcached", description: "Memcached缓存" },
      { port: "1521", protocol: "TCP", service: "Oracle", description: "Oracle数据库" },
      { port: "1433", protocol: "TCP", service: "MS SQL", description: "Microsoft SQL Server" },
      { port: "9042", protocol: "TCP", service: "Cassandra", description: "Apache Cassandra" },
      { port: "9200", protocol: "TCP", service: "Elasticsearch", description: "Elasticsearch HTTP" },
      { port: "9300", protocol: "TCP", service: "Elasticsearch", description: "Elasticsearch集群通信" },
    ]
  },
  {
    title: "邮件服务",
    ports: [
      { port: "25", protocol: "TCP", service: "SMTP", description: "简单邮件传输协议" },
      { port: "465", protocol: "TCP", service: "SMTPS", description: "SMTP over SSL" },
      { port: "587", protocol: "TCP", service: "SMTP", description: "邮件提交端口" },
      { port: "110", protocol: "TCP", service: "POP3", description: "邮局协议v3" },
      { port: "995", protocol: "TCP", service: "POP3S", description: "POP3 over SSL" },
      { port: "143", protocol: "TCP", service: "IMAP", description: "Internet消息访问协议" },
      { port: "993", protocol: "TCP", service: "IMAPS", description: "IMAP over SSL" },
    ]
  },
  {
    title: "远程访问",
    ports: [
      { port: "22", protocol: "TCP", service: "SSH", description: "安全Shell协议" },
      { port: "23", protocol: "TCP", service: "Telnet", description: "远程登录(不安全)" },
      { port: "21", protocol: "TCP", service: "FTP", description: "文件传输协议控制" },
      { port: "20", protocol: "TCP", service: "FTP-Data", description: "文件传输协议数据" },
      { port: "3389", protocol: "TCP", service: "RDP", description: "远程桌面协议" },
      { port: "5900", protocol: "TCP", service: "VNC", description: "虚拟网络计算" },
      { port: "5901-5909", protocol: "TCP", service: "VNC", description: "VNC显示端口" },
    ]
  },
  {
    title: "消息队列",
    ports: [
      { port: "5672", protocol: "TCP", service: "RabbitMQ", description: "RabbitMQ AMQP" },
      { port: "15672", protocol: "TCP", service: "RabbitMQ", description: "RabbitMQ管理界面" },
      { port: "9092", protocol: "TCP", service: "Kafka", description: "Apache Kafka" },
      { port: "2181", protocol: "TCP", service: "Zookeeper", description: "Apache Zookeeper" },
      { port: "4369", protocol: "TCP", service: "EPMD", description: "Erlang端口映射" },
      { port: "1883", protocol: "TCP", service: "MQTT", description: "消息队列遥测传输" },
      { port: "8883", protocol: "TCP", service: "MQTT/SSL", description: "MQTT over SSL" },
    ]
  },
  {
    title: "容器与编排",
    ports: [
      { port: "2375", protocol: "TCP", service: "Docker", description: "Docker API(不安全)" },
      { port: "2376", protocol: "TCP", service: "Docker", description: "Docker API(TLS)" },
      { port: "2377", protocol: "TCP", service: "Docker Swarm", description: "Swarm集群管理" },
      { port: "6443", protocol: "TCP", service: "Kubernetes", description: "K8s API服务器" },
      { port: "10250", protocol: "TCP", service: "Kubelet", description: "Kubelet API" },
      { port: "10251", protocol: "TCP", service: "Kube-scheduler", description: "调度器" },
      { port: "10252", protocol: "TCP", service: "Kube-controller", description: "控制器管理器" },
      { port: "2379", protocol: "TCP", service: "etcd", description: "etcd客户端" },
      { port: "2380", protocol: "TCP", service: "etcd", description: "etcd对等通信" },
    ]
  },
  {
    title: "网络服务",
    ports: [
      { port: "53", protocol: "TCP/UDP", service: "DNS", description: "域名系统" },
      { port: "67", protocol: "UDP", service: "DHCP", description: "DHCP服务器" },
      { port: "68", protocol: "UDP", service: "DHCP", description: "DHCP客户端" },
      { port: "123", protocol: "UDP", service: "NTP", description: "网络时间协议" },
      { port: "161", protocol: "UDP", service: "SNMP", description: "简单网络管理协议" },
      { port: "162", protocol: "UDP", service: "SNMP-Trap", description: "SNMP陷阱" },
      { port: "514", protocol: "UDP", service: "Syslog", description: "系统日志" },
      { port: "1080", protocol: "TCP", service: "SOCKS", description: "SOCKS代理" },
      { port: "3128", protocol: "TCP", service: "Squid", description: "HTTP代理" },
      { port: "8888", protocol: "TCP", service: "Proxy", description: "通用代理端口" },
    ]
  },
  {
    title: "其他常用服务",
    ports: [
      { port: "111", protocol: "TCP/UDP", service: "RPC", description: "远程过程调用" },
      { port: "139", protocol: "TCP", service: "NetBIOS", description: "NetBIOS会话服务" },
      { port: "445", protocol: "TCP", service: "SMB", description: "服务器消息块" },
      { port: "873", protocol: "TCP", service: "rsync", description: "远程同步" },
      { port: "1194", protocol: "UDP", service: "OpenVPN", description: "OpenVPN" },
      { port: "3478", protocol: "UDP", service: "STUN", description: "NAT穿透" },
      { port: "5060", protocol: "TCP/UDP", service: "SIP", description: "会话发起协议" },
      { port: "8000", protocol: "TCP", service: "HTTP-Alt", description: "备用HTTP端口" },
      { port: "9000", protocol: "TCP", service: "PHP-FPM", description: "PHP FastCGI" },
      { port: "9999", protocol: "TCP", service: "Custom", description: "自定义服务" },
    ]
  },
];

function PortCard({ port, protocol, service, description }: PortItem) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(port);
    setCopied(true);
    toast.success(`已复制端口 ${port}`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={handleCopy}
      className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
    >
      <div className="w-16 h-12 flex items-center justify-center rounded-md bg-primary/10 text-primary font-mono font-bold text-lg">
        {port}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">{service}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
            {protocol}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
    </div>
  );
}

export default function PortsReference() {
  return (
    <ToolLayout
      title="常用端口号"
      description="网络服务常用端口速查表"
      icon={Network}
    >
      <div className="space-y-8">
        {portData.map((section) => (
          <div key={section.title}>
            <h2 className="text-lg font-semibold text-foreground mb-4">{section.title}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {section.ports.map((port) => (
                <PortCard key={`${port.port}-${port.service}`} {...port} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
