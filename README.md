# kankinge-solver

[監禁ゲー(NSFW)](https://www.dlsite.com/maniax/work/=/product_id/RJ312391.html) をプログラムで解く試み。

## 実行方法

```sh
deno task exec <map_file>
```

## 開発環境

```sh
> deno --version
deno 2.6.3 (stable, release, aarch64-apple-darwin)
v8 14.2.231.17-rusty
typescript 5.9.2
```

## メモ

状態空間の大きさは$\Theta(b^d)$。解の深さ$d$が$150$程度だとすると、

| 分枝度 $b$ |         $b^{150}$ |
| :--------- | ----------------: |
| 1.00       |               $1$ |
| 1.05       |           $1,508$ |
| 1.10       |       $1,617,718$ |
| 1.15       |   $1,272,553,509$ |
| 1.20       | $753,679,854,846$ |

となる。分枝度を$1.10$程度へ抑えないと現実的な時間では解けなさそう。
